function CreateAccount() {
  return (
    <div>
      <form>
        <div>
          <p>User Name</p>
          <input
            type="email"
            id="email"
            placeholder="Johndoe@gmail.com"
            className="focus:outline-none"
          ></input>
        </div>
        <div>
        <p>Email</p>
        <input
            type="password"
            id="password"
            placeholder=""
            className="focus:outline-none"
          ></input> 
        </div>
        <div>
        <p>Password</p>
        <input
            type="password"
            id="confirm password"
            placeholder=""
            className="focus:outline-none"
          ></input> 
        </div>
        <button type="submit">Create account</button>
      </form>
      <div>
        <div>Login with Google</div>
        <div>Login with Facebook</div>
        <div>Login with Twitter</div>
      </div>
    </div>
  );
}

export default CreateAccount;
