---
layout: blog.liquid
title:  "Adding TLS/SSL support with APR Network library and OpenSSL"
categories: ["blog"]
---

During my work at [vernacular.ai](https://vernacular.ai) I came across a problem in our telephony setup. Some of our clients wanted TLS support even if the setup runs on premise without any internet access.

[Unimrcp](https://github.com/unispeech/unimrcp) uses apr library for MRCP and SIP. APR does not have out of box support for TLS, hence the blog. Instructions on installing APR can be found [here](https://apr.apache.org/compiling_unix.html).


### Creating a simple TCP server

Let us start with a simple tcp server implemented using `apr_network_io`.

1. Initialize the apr_pool

```c
#include "apr.h"
#include "apr_network_io.h"

int main() {
    apr_pool_t *pool;

    apr_initialize();
    atexit(apr_terminate);

    // create apr pool
    apr_pool_create(&pool, NULL);

    return 0;
}
```

2. Create a listening socket on a port.

```c
apr_status_t create_listening_socket(apr_pool_t *pool, apr_socket_t **lskt, int port) {
    apr_sockaddr_t *saddr;

    // create a tcp socket
    apr_status_t rv = apr_socket_create(lskt, APR_INET, SOCK_STREAM, APR_PROTO_TCP, pool);
    if (rv)
       return rv;

    rv = apr_sockaddr_info_get(&saddr, "127.0.0.1", APR_UNSPEC, port, 0, pool);
    if (rv)
        return rv;

    // bind the localhost:<port> to the created listening socket
    rv = apr_socket_bind(*lskt, saddr);
    if (rv)
        return rv;

    // now listen for incoming connections on this socket
    rv = apr_socket_listen(*lskt, 5);
    if (rv)
        return rv;
    
    return rv;
}
```

3. Now we can implement the part that will handle the incoming connections.

```c
apr_status_t start_server(apr_pool_t *pool, int port) {
    apr_status_t rv = APR_SUCCESS;
    apr_pool_t *subpool;
    apr_socket_t *lskt;

    // create listening socket
    rv = create_listening_socket(pool, &lskt, port);
    if (rv) {
        return rv;
    }

    printf("running the server on 127.0.0.1:%d\n", port);

    apr_pool_create(&subpool, pool);
    for (;;) {
        apr_socket_t *cskt;
        apr_pool_clear(subpool);

        rv = apr_socket_accept(&cskt, lskt, subpool);
        if (rv)
            return rv;

        while(1) {
            apr_size_t len = 1024;
            char buf[1024] = {0};

            // receive data from client
            rv = apr_socket_recv(cskt, &buf, &len);
            if (rv) {
                break;
            }
            // echo the same data back
            apr_socket_send(cskt, &buf, &len);
        }
        apr_socket_close(cskt);
    }

    return rv;
}
```
Our server just echoes back whatever data it has read. Now call this function from `main`.

```c
int main() {
    //  apr pool creation
    // ...

    apr_status_t rv = start_server(pool, 8000);
    if (rv) {
        char buffer[256] = { 0 };
        printf("error: %s\n", apr_strerror(rv, buffer, sizeof(buffer)));
    }

    return 0;
}
```

You can build the server like this:
```shell
# build the server
gcc -I/usr/local/apr/include/apr-1/ -Wl,-rpath,/usr/local/apr/lib -o echoserver echoserver.c -L/usr/local/apr/lib -lapr-1

# run the server
./echoserver
```

### Adding TLS to TCP Server

We will be using [OpenSSL](https://github.com/openssl/openssl) library to add TLS support. Let us implement some functions like `apr_network_io.c` to account for SSL.

1. Add functions for initialize & destroy OpenSSL Context.
```c
int load_ssl_certificate(SSL_CTX* ctx, char* cert_file, char* key_file) {
    /* set the local certificate */
    if (SSL_CTX_use_certificate_file(ctx, cert_file, SSL_FILETYPE_PEM) <= 0) {
        return 0;
    }
    /* set the private key */
    if (SSL_CTX_use_PrivateKey_file(ctx, key_file, SSL_FILETYPE_PEM) <= 0 ) {
        return 0;
    }
    /* verify private key */
    if (!SSL_CTX_check_private_key(ctx)) {
        return 0;
    }
    return 1;
}

int apr_tls_server_destroy(SSL_CTX *ssl_ctx) {
    if (ssl_ctx != NULL) {
        SSL_CTX_free(ssl_ctx);
        ssl_ctx = NULL;
    }
    return 1;
}

SSL_CTX* apr_tls_server_init(char* cert_file_path, char* key_file_path) {
    SSL_CTX *ssl_ctx;

    SSL_library_init();
    SSL_load_error_strings();   /* load all error messages */

    ssl_ctx = SSL_CTX_new(TLSv1_2_server_method());   /* create new context from method */
    if (ssl_ctx == NULL) {
        return NULL;
    }
    if (load_ssl_certificate(ssl_ctx, cert_file_path, key_file_path) == 0) {
        apr_tls_server_destroy(ssl_ctx);
        return NULL;
    }

    return ssl_ctx;
}
```

2. Add functions for socket accept, read and write wrapping around apr functions.

```c
apr_status_t apr_tls_socket_accept(apr_socket_t **new_sock, apr_socket_t *sock,
    SSL_CTX *ssl_ctx, SSL **ssl_sock, apr_pool_t *connection_pool
) {
    apr_status_t status = apr_socket_accept(new_sock, sock, connection_pool);
    if (status) {
        return status;
    }
    if (ssl_ctx != NULL) {
        apr_os_sock_t raw_sock;
        status = apr_os_sock_get(&raw_sock, *new_sock);
        if (status)
            return status;

        // create new ssl state from ssl context
        *ssl_sock = SSL_new(ssl_ctx);
        SSL_set_fd(*ssl_sock, raw_sock);

        // do ssl handshake
        if (SSL_accept(*ssl_sock) != 1) {
            printf("SSL Handshake failed");
            return 1;
        }
    }
    return status;
}

apr_status_t apr_tls_socket_recv(apr_socket_t *sock, SSL *ssl_sock, char *buf, apr_size_t *len) {
    if (ssl_sock == NULL) {
        return apr_socket_recv(sock, buf, len);
    } else {
        int bytes_read = SSL_read(ssl_sock, buf, *len);
        *len = (apr_size_t)bytes_read;
        if (SSL_get_error(ssl_sock, bytes_read) > 0) {
            return 1;
        }
        return APR_SUCCESS;
    }
}

apr_status_t apr_tls_socket_send(apr_socket_t *sock, SSL *ssl_sock, const char *buf, apr_size_t *len) {
    if (ssl_sock == NULL) {
        return apr_socket_send(sock,buf,len);
    } else {
        int bytes_wrote = SSL_write(ssl_sock, buf, *len);
        *len = (apr_size_t)bytes_wrote;
        if (SSL_get_error(ssl_sock, bytes_wrote) > 0) {
            return 1;
        }
        return APR_SUCCESS;
    }
}

apr_status_t apr_tls_socket_close(apr_socket_t *thesocket, SSL *ssl_sock) {
    if (ssl_sock != NULL) {
        SSL_free(ssl_sock);
    }
    return apr_socket_close(thesocket);
}
```

They have the same function signature as `apr_socket_accept`, `apr_socket_recv`, `apr_socket_send` & `apr_socket_close` except ssl socket is also added. You can think of it like we are wrapping a another socket around apr_socket to handle SSL encryption/decryption.

3. Now we just need to add it to `echoserver.c` tying everything up.

```c
#include "apr.h"
#include "apr_network_io.h"
#include "apr_portable.h"
#include "openssl/ssl.h"
#include "openssl/err.h"
#include <stdlib.h>

int main() {
    //  apr pool creation
    // ...

    // init ssl context
    SSL_CTX *ssl_ctx = apr_tls_server_init("/path/to/certificate.pem", "/path/to/keyfile.pem");

    apr_status_t rv = start_server(pool, ssl_context, 8000);
    if (rv) {
        char buffer[256] = { 0 };
        printf("error: %s\n", apr_strerror(rv, buffer, sizeof(buffer)));
    }

    // destroy ssl context
    apr_tls_destroy(ssl_ctx);

    return 0;
}
```

Now we will implement `start_server` function with ssl. Just replace apr functions with corresponding `apr_tls_*` functions.

```c
apr_status_t start_server(apr_pool_t *pool, SSL_CTX *ssl_ctx, int port) {
    apr_status_t rv = APR_SUCCESS;
    apr_pool_t *subpool;
    apr_socket_t *lskt;

    // creation of listening socket will remain same
    rv = create_listening_socket(pool, &lskt, port);
    if (rv) {
        return rv;
    }

    printf("running the TLS server on 127.0.0.1:%d\n", port);

    apr_pool_create(&subpool, pool);
    for (;;) {
        apr_socket_t *cskt;
        SSL *ssl_socket;

        apr_pool_clear(subpool);

        // connect to an incoming socket connection
        rv = apr_tls_socket_accept(&cskt, lskt, ssl_ctx, &ssl_socket, subpool);
        if (rv)
            return rv;

        while(1) {
            apr_size_t len = 1024;
            char buf[1024] = {0};

            rv = apr_tls_socket_recv(cskt, ssl_socket, &buf, &len); // read data
            if (rv) {
                break;
            }
            rv = apr_tls_socket_send(cskt, ssl_socket, &buf, &len); // write same data back
            break;
        }
        apr_tls_socket_close(cskt, ssl_socket);
    }

    return rv;
}
```
### Building and Testing the Server

You can build the server like this [Take care to include libssl & libcrypto]: 
```sh
gcc -I/usr/local/apr/include/apr-1/ -Wl,-rpath,/usr/local/apr/lib -o echoserver echoserver.c -L/usr/local/apr/lib -lapr-1 -lssl -lcrypto
```

To test the server use openssl client
```sh
openssl s_client -connect localhost:8000
```

You can also find the full code [here](https://gist.github.com/deep110/a7e5fbc31dea6989907d3dc595efdc4e).
Hope this helps people to start with openssl and APR library and how they can be used to build a fully functional TCP server with TLS support.
