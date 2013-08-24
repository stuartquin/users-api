package main

import (
	"fmt"
	"net/http"
	"github.com/stuartquin/usersapi/controllers"
)

func handler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hello UserAPI")
}

func main() {
	http.HandleFunc("/", handler)
	http.HandleFunc("/create", controllers.CreateUser)
	http.ListenAndServe(":8080", nil)
}
