package com.pluralsight.model;

import javax.validation.constraints.Size;

import org.hibernate.validator.constraints.Email;
import org.hibernate.validator.constraints.NotEmpty;

public class Attendee {
 
	@NotEmpty @Email
	private String emailAddress;
	
	@Size(min=2,max=30)
	private String name;

	public String getEmailAddress() {
		return emailAddress;
	}

	public String getName() {
		return name;
	}

	public void setEmailAddress(String emailAddress) {
		this.emailAddress = emailAddress;
	}

	public void setName(String name) {
		this.name = name;
	}

}
