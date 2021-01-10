---
layout: blog.liquid
title:  "Understanding difference between Digital and Paint Colors"
categories: ["blog"]
---

Before going into the any of this I would like to talk about why I wrote this:
- I have also been little confused a little with color theory and models in the past
- I came across an excellent [thread](https://www.reddit.com/r/askscience/comments/ksgy8l/why_if_i_mix_green_and_red_paints_in_equal/) on reddit regarding this and I loved the explanation there.
- Few years back I wasted a lot of money to get right color prints of some photos

Anyways, I thought let me also take a shot at this.

The question the person asked was this:
> Why if I mix green and red paints in equal proportions, I see a desaturated brown, but if I mix green and red light in equal proportions like in an LCD screen, I get pure yellow?

To answer this it is important to understand difference between colors we directly see because of light and paint colors.

### Light and RGB Color Model

We all know that [visible spectrum](https://en.wikipedia.org/wiki/Visible_spectrum) [390nm - 750nm] is the range of wavelength that human eye can see and this gives us the colors.
But why is that Red, Green and Blue are the primary colors for the light. It is because eye have three [types of cones](https://en.wikipedia.org/wiki/Color#Color_in_the_eye), each sensitive to range of wavelength corresponding to those colors. [Here](https://en.wikipedia.org/wiki/Photoreceptor_cell) is a detailed explanation on photoceptor cells in our eyes.

<div style="text-align:center"><img src="/assets/images/2021-01/cones-responses.png"/></div>
<div style="text-align:center">Source: <a href="https://en.wikipedia.org/wiki/Color#Color_in_the_eye">wikipedia</a></div>

<br>
So for example if you take yellow light [wavelength = 580nm], it will be sensitive to both Red and Green cones in the eye and thus gives us the perception of yellow color.

> Fun fact: Our eyes being more sensitive to warm colors than cold can easily be seen from the graph.

This is exactly how we also see colors on a display screen. You can read more about how we see colors on a screen [here](https://www.chem.purdue.edu/gchelp/cchem/RGBColors/body_rgbcolors.html).

Now let us talk about mixing of monochromatic light. You can roughly get a final color by this formula:
```js
function mix_color_light(Color c1, Color c2) {
    return new Color(
        min(c1.r+c2.r, 255),
        min(c1.g+c2.g, 255),
        min(c1.b+c2.b, 255),
    );
}
```

Let us think what this formula will give,
```
Red + Black        = Red
Red + Green        = Yellow
Red + Green + Blue = White
Red + White        = White
```

Black is nothing but absence of light, which makes sense right, if you add red light into nothing you should see red light.
Similarly white light is a mixture of all three light components, hence adding more red, or green or blue won't change the color of final light produced.

Because of this, RGB color model is called as **Additive Color Model**. Mixing lights of all colors will eventually get you to white.

Now think of above table in terms of paints, it is completely weird right? Red and Black color paint should produce what - darker shade of red.

### Paint and CMYK Color Space

The basis for understanding paints is how we see color of objects. So for a object to appear green, it should absorb all visible wavelengths except for green light. Hence green light will reach the eyes and we will perceive that object as green. Similarly for an object to appear,

- White - It has to absorb no visible wavelength
- Black - It has to absorb all visible wavelength

That is why primary colors for paints are as follows:
```
Cyan => Reflects all color except Red
Magenta => Reflects all color except Green
Yellow => Reflects all color except Blue
```
This is thus called **Subtractive Model** because paint color subtracts that color from white light.

> Then what about K in CMYK?

This model is primarily used for printing, `K` stands for key which is usually black ink in printers. This is needed because when mixing CMY color inks you get a dark grey or faded black color. Thus to produce perfect black in printing, black colored ink is directly used. Also a lot of times it is cheaper to make dark shades of lot of colors using black ink rather than mixing CMY colors.

<div style="text-align:center"><img src="/assets/images/2021-01/CMYK_subtractive_color_mixing.png"/></div>
<div style="text-align:center">Source: <a href="https://en.wikipedia.org/wiki/CMYK_color_model">wikipedia</a></div>

In the above picture, as you can see that you can make primary colors for RGB model from mixing primary colors of CMYK. For example if we mix yellow [which only absorbs blue light] and cyan [which only absorbs red light], we get a paint that absorbs both blue & red light but reflect everything that is left i.e green light.

Obviously CMYK model used in printing industry is not very straight forward, because it is hard to produce the all the colors with pigments, but more or less the idea remains the same. 
