import deleteIcon from "../../../../public/icons/delete.svg";
import Image from "next/image";

function DeleteBox() {
  return (
    <div className="fixed z-10 top-0 bottom-0 left-0 right-0 flex items-center justify-center">
      <div
        className="bg-white text-p-text pb-5 h-[350px] w-[700px]
        flex flex-col px-4"
      >
        <p className="text-red-600 font-bold p-2 text-2xl">Delete</p>
        <div className="flex gap-2 mt-5 items-center">
          <Image
            alt="delete Icon"
            src={deleteIcon}
            width={78}
            height={78}
            className="p-2 w-[20%]"
          />
          <p className="w-[80%] text-xl">
            Are You sure want to delete Full Stack web development? By doing
            this you Permantely delete the Practice question and summaries{" "}
          </p>
        </div>
        <div className="flex flex-col">
          <div className="text-xl text-black mx-auto flex flex-col gap-2">
            <label>Type “Delete” to confirm deletion</label>
            <input
              type="text"
              name="delete"
              placeholder="Type here"
              className="border-2 border-p-text p-1"
            />
          </div>
          <div className="flex items-center gap-4 w-[300px] mx-auto justify-end py-3">
            <div className="text-black">Cancel</div>
            <div className="text-white bg-red-600 p-2 rounded-md">Delete</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteBox;
