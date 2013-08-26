package models

import (
    "labix.org/v2/mgo"
)

type User struct {
	Email string
	Password string
	Active bool
}

func (u *User) Output() string {
	result := "Hello " + u.Email
	return result
}

func (u *User) Save() (bool, error) {
    // Establish a session, pools are managed by mgo
    session, err := mgo.Dial("localhost")
    if err != nil {
        panic(err)
    }
    defer session.Close()

    c := session.DB("users-api").C("users")
    err = c.Insert(u)

    if err != nil {
        return false, err
    }

    return true, nil
}
