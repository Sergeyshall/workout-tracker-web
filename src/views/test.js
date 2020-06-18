import React, { useState, useMemo, useEffect } from "react";

const getFormField = (form, name) => {
  const formFieldKey = Object.keys(form).find(key => form[key].name === name);
  return form[formFieldKey];
};

const initState = { name: 'Sergii', lastName: 'Shalapuda' };

const Test = (props) => {
  const [user, setUser] = useState(initState);

  const updateUser = () => {
    setUser({name: "Test", lastName: "test2"});
  };

  useEffect(() => {
    // Trigger only once since second parameter is empty array []
    console.log("effect triggered on component will mount");

    // returned function will be called on component unmount
    return () => {
      console.log("effect triggered on component will unmount");
    }
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    event.persist();
    const form = event.target;
    console.log(event);
    const nameField = getFormField(form, "name");
    const lastName = getFormField(form, "lastName");

    const user = {
      name: nameField && nameField.value,
      lastName: lastName && lastName.value
    };

    setUser(user);
  };

  console.log(111111);

  return <div className="test-view">
    {console.log(22222)}
    <h2>TEST {`${user.name} ${user.lastName}`}</h2>
    <form name="updateUser" onSubmit={handleSubmit}>
      <label className="form-field">Name: <input type="string" name="name"/></label>
      <label className="form-field">Lat Name: <input type="string" name="lastName"/></label>
      <button type="submit">Set new name</button>
    </form>
  </div>;
};

export default Test;
