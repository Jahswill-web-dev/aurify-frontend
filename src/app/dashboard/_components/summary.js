function truncateText(text, maxLength) {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + "...";
}

function Summary() {
  return (
    <div className="dashboard-main">
      <div>
        <div className="flex flex-col gap-2 my-2">
          <h2 className="text-2xl text-primary">Summary</h2>
        </div>
        <div className="my-4">
          <p className="text-lg text-primary font-semibold">Name</p>
          <div
            className="bg-secondary text-p-text border-t-2 border-primary 
        pt-1 pb-4 pl-5"
          >
            {truncateText("Full Stack Web Development Practice questions", 60)}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 mt-10 px-2">
        <h2 className="text-2xl font-semibold text-primary">First Heading</h2>
        <p className="text-p-text text-lg">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum
          dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. Risus nullam eget felis
          eget nunc lobortis mattis aliquam. Id donec ultrices tincidunt arcu
          non sodales neque sodales ut. Habitant morbi tristique senectus et
          netus et malesuada. Egestas purus viverra accumsan in nisl nisi. Augue
          
          neque gravida in fermentum et sollicitudin ac.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum
          dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. Risus nullam eget felis
          eget nunc lobortis mattis aliquam. Id donec ultrices tincidunt arcu
          non sodales neque sodales ut. Habitant morbi tristique senectus et
          netus et malesuada. Egestas purus viverra accumsan in nisl nisi. Augue
          neque gravida in fermentum et sollicitudin ac.
          neque gravida in fermentum et sollicitudin ac.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum
          dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. Risus nullam eget felis
          eget nunc lobortis mattis aliquam. Id donec ultrices tincidunt arcu
          non sodales neque sodales ut. Habitant morbi tristique senectus et
          netus et malesuada. Egestas purus viverra accumsan in nisl nisi. Augue
          neque gravida in fermentum et sollicitudin ac.
          neque gravida in fermentum et sollicitudin ac.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum
          dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. Risus nullam eget felis
          eget nunc lobortis mattis aliquam. Id donec ultrices tincidunt arcu
          non sodales neque sodales ut. Habitant morbi tristique senectus et
          netus et malesuada. Egestas purus viverra accumsan in nisl nisi. Augue
          neque gravida in fermentum et sollicitudin ac.
          neque gravida in fermentum et sollicitudin ac.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum
          dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. Risus nullam eget felis
          eget nunc lobortis mattis aliquam. Id donec ultrices tincidunt arcu
          non sodales neque sodales ut. Habitant morbi tristique senectus et
          netus et malesuada. Egestas purus viverra accumsan in nisl nisi. Augue
          neque gravida in fermentum et sollicitudin ac.
        </p>
      </div>
    </div>
  );
}

export default Summary;
