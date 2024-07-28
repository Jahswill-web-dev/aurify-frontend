function Details() {
  return (
    <div className="overflow-hidden w-0 lg:w-[30%] bg-green-700">
      <div>Fullstack webdevelopment</div>
    </div>
  );
}

function Main() {
  return (
    <div className="pl-4 w-[70%] lg:w-[80%] ">
      <div className="w-full flex h-full">
          {/* Main */}
          <div className="bg-black h-full w-[100%] lg:w-[70%]">summarized Pdfs</div>
          {/* Details */}
          <Details />
      </div>
    </div>
  );
}

export default Main;
