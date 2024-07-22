function CreateAccount() {
  return (
    <div>
      <form>
        <div className="flex flex-col items-center justify-center gap-4 mt-4">
          <div>
            <p className="text-p-text-darker pb-2 text-lg">User Name</p>
            <input
              type="email"
              id="email"
              placeholder="Johndoe@gmail.com"
              className="focus:border-primary border-p-text-darker w-64 h-[35px] text-x-sub-head border-2"
            ></input>
          </div>
          <div>
            <p className="text-p-text-darker pb-2 text-lg">Email</p>
            <input
              type="password"
              id="password"
              placeholder=""
              className="focus:border-primary border-p-text-darker w-64 h-[35px] text-x-sub-head border-2"
            ></input>
          </div>
          <div>
            <p className="text-p-text-darker pb-2 text-lg">Password</p>
            <input
              type="password"
              id="confirm password"
              placeholder=""
              className="focus:border-primary border-p-text-darker w-64 h-[35px] text-x-sub-head border-2"
            ></input>
          </div>
        </div>
        <button type="submit" className="my-4">Create account</button>
      </form>
      <div className="flex flex-col items-center justify-center">
        <div>Login with Google</div>
        <div>Login with Facebook</div>
        <div>Login with Twitter</div>
      </div>
    </div>
  );
}

export default CreateAccount;
