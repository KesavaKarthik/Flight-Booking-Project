package com.example.flight_project_backend;

import jakarta.persistence.*;

@Entity
@Table(name = "login")

public class Login {
    @Id
    @Column(name = "email_id")
    private String emailId;

    @Column( name = "password")
    private String password;

    public Login(){}
    
    public String getEmailId(){
        return emailId;


    }
    public String getPassword(){
        return password;


    }
    public void setEmailId(String email_id){
        this.emailId = email_id;


    }
    public void setPassword(String password){
        this.password = password;


    }
    
}
