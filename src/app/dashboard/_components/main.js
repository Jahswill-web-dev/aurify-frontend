function Details() {
  return (
    <div className="overflow-hidden w-0 lg:w-[30%] bg-green-700">
      <div>Fullstack webdevelopment</div>
    </div>
  );
}

function Main() {
  return (
    <div className="px-4 w-full md:w-[70%] lg:w-[80%] mt-7 md:mt-0">
      <div className="w-full flex h-full">
          {/* Main */}
          <div className="bg-black h-full w-[100%] lg:w-[70%] min-h-[600px]">summarized Pdfs</div>
          {/* Details */}
          <Details />
      </div>
    </div>
  );
}

export default Main;
