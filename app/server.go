package main

import (
    "net/http"
    "flag"
    "log"
)

var port = flag.String("port", "3000", "Port to use")

func main() {
    flag.Parse()
    log.Println("Magic happens at port: " + *port)
    panic(http.ListenAndServe(":" + *port, http.FileServer(http.Dir("./public"))))
}