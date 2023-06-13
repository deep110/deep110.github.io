class GLUtil {
    static create2DTexture(gl, format, type, width, height, data, wrapS, wrapT, minFilter, magFilter) {
        let texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, format, width, height, 0, format, type, data);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT);

        gl.bindTexture(gl.TEXTURE_2D, null);

        return texture;
    }
}


var Matrix33 = {
    multiply: function(a, b) {
        var a00 = a[0 * 3 + 0];
        var a01 = a[0 * 3 + 1];
        var a02 = a[0 * 3 + 2];
        var a10 = a[1 * 3 + 0];
        var a11 = a[1 * 3 + 1];
        var a12 = a[1 * 3 + 2];
        var a20 = a[2 * 3 + 0];
        var a21 = a[2 * 3 + 1];
        var a22 = a[2 * 3 + 2];
        var b00 = b[0 * 3 + 0];
        var b01 = b[0 * 3 + 1];
        var b02 = b[0 * 3 + 2];
        var b10 = b[1 * 3 + 0];
        var b11 = b[1 * 3 + 1];
        var b12 = b[1 * 3 + 2];
        var b20 = b[2 * 3 + 0];
        var b21 = b[2 * 3 + 1];
        var b22 = b[2 * 3 + 2];

        return [
            b00 * a00 + b01 * a10 + b02 * a20,
            b00 * a01 + b01 * a11 + b02 * a21,
            b00 * a02 + b01 * a12 + b02 * a22,
            b10 * a00 + b11 * a10 + b12 * a20,
            b10 * a01 + b11 * a11 + b12 * a21,
            b10 * a02 + b11 * a12 + b12 * a22,
            b20 * a00 + b21 * a10 + b22 * a20,
            b20 * a01 + b21 * a11 + b22 * a21,
            b20 * a02 + b21 * a12 + b22 * a22,
        ];
    },
    projection: function(w, h) {
        return [
            2 / w, 0, 0,
            0, 2 / h, 0,
            -1, -1, 1,
        ];
    },
    translate: function(m, tx, ty) {
        return this.multiply(m, [
            1, 0, 0,
            0, 1, 0,
            tx, ty, 1,
        ]);
    },
    scale: function(m, sx, sy) {
        return this.multiply(m, [
            sx, 0, 0,
            0, sy, 0,
            0, 0, 1,
        ]);
    },
}

const canvas = document.getElementById("main-canvas");
const gl = canvas.getContext('webgl');
const DEFAULT_WIDTH = canvas.width;
const DEFAULT_HEIGHT = canvas.height;

const MAX_BRISTLE_COUNT = 100;
const MIN_BRISTLE_COUNT = 10;
const MIN_BRUSH_SCALE = 30;
const MAX_BRUSH_SCALE = 100;

let isFullScreen = false;
let brush = undefined;
let painting = undefined;
let gui = new lil.GUI({ container: document.getElementById("paint-settings") });
let guiController = {
    "PaintColor": 0xc47b3c,
    "PaintFluidity": 0.6,
    "BristleCount": 30,
    "BrushScale": 50,
}

class Brush {
    constructor(paintColor, size) {
        this.posX = DEFAULT_WIDTH/2;
        this.posY = DEFAULT_HEIGHT/2;
        this.paintColor = paintColor;
        this.size = size;
        this.projectionMatrix = Matrix33.projection(canvas.width, canvas.height);

        const vs = `
            attribute vec2 position;
            attribute vec2 texcoord;
            uniform mat3 modelView;

            void main() {
                vec3 clipSpace = modelView * vec3(position, 1);
                gl_Position = vec4(clipSpace.xy, 0, 1);
            }
        `;
        const fs = `
            precision mediump float;

            void main() {
                gl_FragColor = vec4(1, 0, 0, 0.5);
            }
        `;
        const model = {
            position: {
                numComponents: 2,
                data: [-0.5, -0.5, 0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5]
            }
        }

        this.programInfo = twgl.createProgramInfo(gl, [vs, fs]);
        this.bufferInfo = twgl.createBufferInfoFromArrays(gl, model);
    }

    render() {
        let matrix = Matrix33.translate(this.projectionMatrix, this.posX, this.posY);
        matrix = Matrix33.scale(matrix, this.size + 10, this.size);

        const uniforms = {
            "modelView": matrix,
        };
    
        gl.useProgram(this.programInfo.program);
        twgl.setBuffersAndAttributes(gl, this.programInfo, this.bufferInfo);
        twgl.setUniforms(this.programInfo, uniforms);
        twgl.drawBufferInfo(gl, this.bufferInfo);
    }

    updatePosition(mouseX, mouseY) {
        var bounds = canvas.getBoundingClientRect();
        this.posX = mouseX - bounds.left;
        this.posY = canvas.height - (mouseY - bounds.top);
    }

    onResize() {
        this.projectionMatrix = Matrix33.projection(canvas.width, canvas.height);
    }
}

class Painting {
    constructor() {
        this.points = [];
        this.isBrushDown = false;

        // create a paint texture
        let data = [255, 0, 0, 255, 0, 255, 0, 255, 
                    0, 255, 0, 255, 255, 0, 0, 255];
        this.paintTexture = GLUtil.create2DTexture(gl, gl.RGBA, gl.UNSIGNED_BYTE, 2, 2, 
            new Uint8Array(data), gl.REPEAT, gl.REPEAT, gl.NEAREST, gl.NEAREST);

        // render paint texture to framebuffer as color buffer
        // this.framebuffer = gl.createFramebuffer();

        const vertex_shader = `
            attribute vec2 position;
            varying vec2 texcoord;

            void main() {
                gl_Position = vec4(position * 2.0, 0, 1);
                texcoord = position + vec2(0.5, 0.5);
            }
        `;
        const fragment_shader = `
            precision mediump float;

            varying vec2 texcoord;
            uniform sampler2D u_sampler;

            void main() {
                gl_FragColor = texture2D(u_sampler, texcoord);
            }
        `;

        this.program = twgl.createProgram(gl, [vertex_shader, fragment_shader]);
        this.positionLocation = gl.getAttribLocation(this.program, "position");
        this.textureUniformLocation = gl.getUniformLocation(this.program, 'u_sampler');

        const bufferData = {
            position: [-0.5, 0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5],
        };
        this.vertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bufferData.position), gl.STATIC_DRAW);
    }

    onResize() {
        gl.viewport(0, 0, canvas.width, canvas.height);
    }

    brushDown(brush) {
        this.isBrushDown = true;
    }

    brushMove(brush) {
        if(this.isBrushDown) {
            // console.log("i am drawing");
        }
    }

    brushUp(brush) {
        this.isBrushDown = false;
    }

    render() {
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.useProgram(this.program);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
        gl.vertexAttribPointer(this.positionLocation, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.positionLocation);

        // gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
        // gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.paintTexture, 0);
        // gl.clearColor(1, 0, 0, 1);
        // gl.clear(gl.COLOR_BUFFER_BIT);

        // // unbind the framebuffer
        // gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.paintTexture);
        gl.uniform1i(this.textureUniformLocation, 0);

        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    }
}

function setupGUI() {
    gui.addColor(guiController, "PaintColor").onChange(value => {
        brush.paintColor = value;
    });
    gui.add(guiController, "PaintFluidity", 0, 1, 0.1);
    gui.add(guiController, "BristleCount", MIN_BRISTLE_COUNT, MAX_BRISTLE_COUNT, 2);
    gui.add(guiController, "BrushScale", MIN_BRUSH_SCALE, MAX_BRUSH_SCALE, 0.1).onChange(value => {
        brush.size = value;
    });
}

function setup() {
    setupGUI();

    brush = new Brush(guiController["PaintColor"], guiController["BrushScale"]);
    painting = new Painting();
    const toggleBtn = document.getElementById("toggle-fs");

    toggleBtn.addEventListener("click", () => {
        canvas.classList.toggle("fullscreen");
        toggleBtn.classList.toggle("fullscreen");
        document.getElementById("paint-settings").classList.toggle("fullscreen");
        isFullScreen = !isFullScreen;

        // also correct drawing buffer size
        if (isFullScreen) {
            toggleBtn.children[1].setAttribute("transform", "translate(16,16)rotate(135)scale(5)translate(-1.85,0)");
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
        } else {
            toggleBtn.children[1].setAttribute("transform", "translate(16,16)rotate(-45)scale(5)translate(-1.85,0)");
            canvas.width = DEFAULT_WIDTH;
            canvas.height = DEFAULT_HEIGHT;
        }
        painting.onResize();
        brush.onResize();
    });

    canvas.addEventListener('mousedown', function(e) {
        brush.updatePosition(e.clientX, e.clientY);
        painting.brushDown(brush);
    });
    canvas.addEventListener('mousemove', function(e) {
        brush.updatePosition(e.clientX, e.clientY);
        painting.brushMove(brush);
    });
    canvas.addEventListener('mouseup', function(_) {
        painting.brushUp(brush);
    });
}

function render() {
    painting.render();
    brush.render();

    requestAnimationFrame(render);
}


setup();
render();
