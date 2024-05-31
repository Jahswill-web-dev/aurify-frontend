import { Circles } from "react-loader-spinner";

function RingSpinner() {
  return (
    <Circles
  height="80"
  width="80"
  color="#F7931A"
  ariaLabel="circles-loading"
  wrapperStyle={{}}
  wrapperClass=""
  visible={true}
  />
  );
}


export {RingSpinner}
