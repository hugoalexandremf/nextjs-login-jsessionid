import { useState } from 'react';
import { fetchWS } from '../components/Utils';
import { useSession, signIn, signOut } from 'next-auth/react';
import { test } from './test';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  /*async function login() {
    let httpResponseDataToReturn;
    console.log('login - username:', username, ' - password:', password);
    try {
      let response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        credentials: 'same-origin',
        redirect: 'manual',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username: username,
          password: password,
        }).toString(),
      });
      httpResponseDataToReturn = {
        httpResponseStatus: response.status,
        responseData: null,
      };
    } catch (error) {
      httpResponseDataToReturn = {
        httpResponseStatus: 500,
        responseData: error,
      };
    }
  }*/

  async function fetchWS(elements) {
    let httpResponseDataToReturn;
    let url = elements.url;
    let headers =
      elements.headers === undefined
        ? {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          }
        : elements.headers;
    let httpRequestElements = {
      method: elements.httpMethod,
      headers: headers,
      credentials: 'include',
      mode: 'cors',
    };
    if (elements.httpMethod === 'POST') {
      httpRequestElements.body = JSON.stringify(elements.body);
    }
    try {
      let response = await fetch(url, httpRequestElements);
      httpResponseDataToReturn = {
        httpResponseStatus: response.status,
      };
      let responseText = await response.text();
      httpResponseDataToReturn.responseData = responseText.length ? JSON.parse(responseText) : null;
    } catch (error) {
      httpResponseDataToReturn = {
        httpResponseStatus: 500,
        responseData: error,
      };
    }

    return httpResponseDataToReturn;
  }

  async function test() {
    const response = await fetchWS({
      url: 'http://localhost:8080/test',
      httpMethod: 'POST',
      body: {},
    });
    if (response.httpResponseStatus === 200) {
      this.getPendingSigs();
    } else {
      if (response.httpResponseStatus !== 500) {
        console.log('500');
      } else {
        console.log('!500');
      }
    }
  }

  async function login_jwt_cookie() {
    console.log('login_jwt_cookie');
    const response = await fetchWS({
      url: 'http://localhost:8080/api/v1/auth/authenticate',
      httpMethod: 'POST',
      body: {},
    });
    if (response.httpResponseStatus === 200) {
      console.log('login_jwt_cookie');
    } else {
      if (response.httpResponseStatus !== 500) {
        console.log('500');
      } else {
        console.log('!500');
      }
    }
  }

  function initializeLogin() {
    console.log('initializeLogin');
    //this.signIn();
  }

  return (
    <div className="container">
      <form>
        <div className="row mb-3">
          <label for="inputEmail3" className="col-sm-2 col-form-label">
            Email
          </label>
          <div className="col-sm-5">
            <input type="email" className="form-control" id="inputEmail3" onChange={setUsername} />
          </div>
        </div>
        <div className="row mb-3">
          <label for="inputPassword3" className="col-sm-2 col-form-label">
            Password
          </label>
          <div className="col-sm-5">
            <input type="password" className="form-control" id="inputPassword3" onChange={setUsername} />
          </div>
        </div>

        <button type="button" className="btn btn-primary" onClick={login_jwt_cookie}>
          Sign in
        </button>
      </form>

      <button type="button" className="btn btn-primary" style={{ marginTop: '50px' }} onClick={test}>
        test endpoint
      </button>

      <form action="/api/auth/signin" method="POST">
        <button type="submit" className="btn btn-primary" style={{ marginTop: '50px' }}>
          Login to authorizationserver
        </button>
      </form>

      <button type="button" className="btn btn-primary" style={{ marginTop: '50px' }} onClick={() => signIn()}>
        Login to authorizationserver - 2
      </button>
    </div>
  );
}
