package controllers

import (
	"fmt"
    "io/ioutil"
	"net/http"
	"encoding/json"
	"github.com/stuartquin/usersapi/models"
)

func CreateUser(w http.ResponseWriter, r *http.Request) {
    if r.Method == "POST" {
        // receive posted data
        body, _ := ioutil.ReadAll(r.Body)

	    var user models.User
	    err := json.Unmarshal(body, &user)
        if err != nil {
	        fmt.Fprintf(w, "Error...")
        }
	    fmt.Fprintf(w, "%+s", user.Email)
        user.Save()
    }
}
