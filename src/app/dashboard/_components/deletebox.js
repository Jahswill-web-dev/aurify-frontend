import deleteIcon from "../../../../public/icons/delete.svg";
import Image from "next/image";

function DeleteBox() {
  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center">
      <div
        className="bg-white text-p-text p-2 h-[300px] w-[700px]"
      >
        <p className="text-red-500 text-xl">Delete</p>
        <div className="flex gap-2">
          <Image alt="delete Icon" src={deleteIcon} width={78} height={78} />
          <p>
            Are You sure want to delete Full Stack web development? By doing
            this you Permantely delete the Practice question and summaries{" "}
          </p>
        </div>
        <div>
          <label>Type “Delete” to confirm deletion</label>
          <input type="text" name="delete" placeholder="type here" />
        </div>
      </div>
    </div>
  );
}

export default DeleteBox;
