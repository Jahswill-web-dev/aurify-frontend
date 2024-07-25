function SideNav() {
  return (
    <div className="w-[20%]">
      {/* Mobile nav */}
      <div className="md:hidden">
        <div
          className="bg-secondary text-primary rounded-xl border-2 border-p-text
      flex gap-2 items-center w-[122px] drop-shadow-xl"
        >
          <svg
            width="44"
            height="44"
            viewBox="0 0 44 44"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20.1673 29.3333V14.3916L15.4007 19.1583L12.834 16.5L22.0007 7.33331L31.1673 16.5L28.6007 19.1583L23.834 14.3916V29.3333H20.1673ZM11.0007 36.6666C9.99232 36.6666 9.12943 36.3079 8.41198 35.5905C7.69454 34.873 7.33521 34.0095 7.33398 33V27.5H11.0007V33H33.0007V27.5H36.6673V33C36.6673 34.0083 36.3086 34.8718 35.5912 35.5905C34.8737 36.3091 34.0102 36.6679 33.0007 36.6666H11.0007Z"
              fill="#F7931A"
            />
          </svg>
          <p className="roboto-font">Upload</p>
        </div>
        <div className="hidden">
          <div>Home</div>
          <div>Bookmarks</div>
          <div>practice Questions</div>
        </div>
        <div className="hidden">Upgrade to Premium</div>
      </div>

      {/* Desktop Nav */}
      <div className="hidden md:flex flex-col">
        {/* Upload button */}
        <div
          className="bg-secondary text-primary rounded-xl border-2 border-p-text
      flex gap-2 items-center w-[122px] drop-shadow-xl"
        >
          <svg
            width="44"
            height="44"
            viewBox="0 0 44 44"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20.1673 29.3333V14.3916L15.4007 19.1583L12.834 16.5L22.0007 7.33331L31.1673 16.5L28.6007 19.1583L23.834 14.3916V29.3333H20.1673ZM11.0007 36.6666C9.99232 36.6666 9.12943 36.3079 8.41198 35.5905C7.69454 34.873 7.33521 34.0095 7.33398 33V27.5H11.0007V33H33.0007V27.5H36.6673V33C36.6673 34.0083 36.3086 34.8718 35.5912 35.5905C34.8737 36.3091 34.0102 36.6679 33.0007 36.6666H11.0007Z"
              fill="#F7931A"
            />
          </svg>
          <p className="roboto-font">Upload</p>
        </div>
        {/* Nav Links */}
        <div className="">
          <div>

            <p>Home</p>
          </div>
          <div>Bookmarks</div>
          <div>practice Questions</div>
        </div>
        {/* upgrade */}
        <div className="">Upgrade to Premium</div>
      </div>
    </div>
  );
}

export default SideNav;
