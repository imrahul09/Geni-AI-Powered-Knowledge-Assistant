import logo from "../assets/blacklogo.png";
import { useContext, useEffect } from "react";
import { MyContext } from "../context/MyContext";
import { v1 as uuidv1 } from "uuid";
import { useAuth } from "../context/AuthContext.jsx";

function Sidebar({ isOpen, onClose }) {
  const {
    allThreads,
    setAllThreads,
    currThreadId,
    setNewChat,
    setPrompt,
    setReply,
    setCurrThreadId,
    setPrevChats,
  } = useContext(MyContext);

  const { token } = useAuth();

  const getAllThread = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/thread`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const res = await response.json();

      const filterData = res.map((thread) => ({
        threadId: thread.threadId,
        title: thread.title,
      }));
      setAllThreads(filterData);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if (token) {
      getAllThread();
    }
  }, [currThreadId, token]);

  // when you try to create a new chat
  const createNewChat = () => {
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(uuidv1());
    setPrevChats([]);

    onClose?.();
  };

  //when you want to see prev chats so you click the previous thread
  const changeThread = async (newThreadId) => {
    setCurrThreadId(newThreadId);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/thread/${newThreadId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const res = await response.json();

      if (!response.ok) {
        console.log("Thread error:", res);
        return;
      }

      setPrevChats(res);
      setNewChat(false);
      setReply(null);
      onClose?.();
    } catch (err) {
      console.log(err);
    }
  };

  const deleteThread = async (threadId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/thread/${threadId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const res = await response.json();
      console.log(res);

      //updated threads re-render
      setAllThreads((prev) =>
        prev.filter((thread) => thread.threadId !== threadId),
      );
      if (threadId === currThreadId) {
        createNewChat();
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}
      <section
        className={`fixed md:static top-0 left-0 z-50 h-screen w-72 md:w-80 bg-[#171717] text-[#b4b4b4] flex flex-col justify-between shrink-0 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="flex items-center justify-between p-4 md:hidden">
          <span className="text-lg text-white">Geni</span>
          <button
            onClick={onClose}
            className="text-xl text-[#b4b4b4] hover:text-white"
          >
            <i className="fa-solid fa-xmark cursor-pointer"></i>
          </button>
        </div>

        <button
          className="flex justify-between items-center m-3 p-3  border border-teal-700 rounded-[10px] bg-transparent hover:bg-[rgba(180,180,180,0.05)] cursor-pointer"
          onClick={createNewChat}
        >
          <img
            src={logo}
            alt="logo"
            className="h-6 w-6 bg-white border rounded-[50%] object-cover "
          />
          <span className="text-[18px]">
            <i className="fa-solid fa-pen-to-square"></i>
          </span>
        </button>

        <ul className="m-3 p-3 h-screen history ">
          {allThreads?.map((thread, idx) => [
            <li
              key={idx}
              onClick={(e) => changeThread(thread.threadId)}
              className={
                thread.threadId === currThreadId
                  ? "bg-[rgba(180,180,180,0.05)] rounded-[10px]"
                  : ""
              }
            >
              {thread.title}
              <i
                className="fa-solid fa-trash  absolute right-0 opacity-0"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteThread(thread.threadId);
                }}
              ></i>
            </li>,
          ])}
        </ul>

        <div className="p-3 m-3 text-[14px] text-center border-t-2 ">
          <p>By Rahul Bhuniya &hearts;</p>
        </div>
      </section>
    </>
  );
}

export default Sidebar;
