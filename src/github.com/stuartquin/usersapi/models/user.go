package models

type User struct {
	Email string
	Password string
	Active bool
}

func (u *User) Output() string {
	result := "Hello " + u.Email
	return result
}
