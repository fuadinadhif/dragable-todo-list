"use client";

import React, { useState } from "react";
import { Todo, FilterType } from "@/types/todo.type";
import { todoData } from "@/data/todo.data";
import Image from "next/image";

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>(todoData);
  const [newTodo, setNewTodo] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [draggedItem, setDraggedItem] = useState<number | null>(null);

  /* -------------------------------------------------------------------------- */
  /*                             Todo Core Functions                            */
  /* -------------------------------------------------------------------------- */
  /* ------------------------------ Add new todo ------------------------------ */
  function addTodo() {
    setTodos([
      ...todos,
      { id: Date.now(), text: newTodo.trim(), completed: false },
    ]);
    setNewTodo("");
  }

  /* ------------------------- Toggle completed status ------------------------ */
  function toggleTodo(id: number) {
    setTodos(
      todos.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : { ...item }
      )
    );
  }

  /* ----------------------- Clear/remove completed todo ---------------------- */
  function clearCompleted() {
    setTodos(todos.filter((item) => !item.completed));
  }

  /* -------------------------------------------------------------------------- */
  /*                           Drag and Drop Functions                          */
  /* -------------------------------------------------------------------------- */
  /* ---------------------------- Handle drag start --------------------------- */
  function handleDragStart(e: React.DragEvent, id: number) {
    setDraggedItem(id);
    e.dataTransfer.effectAllowed = "move";
  }

  /* ----------------------------- Allow drop item ---------------------------- */
  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
  }

  /* ----------------- Handle drop logic (allow reorder items) ---------------- */
  function handleDrop(e: React.DragEvent, dropId: number) {
    e.preventDefault();

    if (draggedItem === null || draggedItem === dropId) {
      setDraggedItem(null);
      return;
    }

    const draggedIndex = todos.findIndex((todo) => todo.id === draggedItem);
    const dropIndex = todos.findIndex((todo) => todo.id === dropId);

    const newTodos = [...todos];
    const draggedTodo = newTodos[draggedIndex];

    newTodos.splice(draggedIndex, 1);
    newTodos.splice(dropIndex, 0, draggedTodo);

    setTodos(newTodos);
    setDraggedItem(null);
  }

  /* ----------------------- Clean up drag functionality ---------------------- */
  function handleDragEnd() {
    setDraggedItem(null);
  }

  /* -------------------------------------------------------------------------- */
  /*                                  Todo Data                                 */
  /* -------------------------------------------------------------------------- */
  /* ------------------- Todo list that already get filtered ------------------ */
  const filteredTodos = todos.filter((item) => {
    if (filter === "active") {
      return !item.completed;
    } else if (filter === "completed") {
      return item.completed;
    } else {
      return true;
    }
  });

  /* ----------------------- Total number of active todo ---------------------- */
  const activeTodo = todos.filter((item) => !item.completed).length;

  return (
    <main className="min-h-screen py-[70px] px-[24px]">
      {/* ------------------------------- Background ------------------------------- */}
      <div className="w-full h-[300px] fixed top-0 left-0">
        <Image
          src="/background.png"
          alt="Background image"
          fill
          className="object-cover"
        />
        <div
          className="absolute inset-0 mix-blend-overlay"
          style={{
            backgroundImage:
              "linear-gradient(135deg, #AC2DEB 0%, #5596FF 100%)",
          }}
        />
      </div>

      {/* ---------------------------- Todo list wrapper --------------------------- */}
      <div className="w-full max-w-[540px] mx-auto relative">
        {/* ---------------------------------- Title --------------------------------- */}
        <h1 className="font-bold text-[40px] tracking-[15px] mb-[40px] text-white">
          TODO
        </h1>

        {/* ----------------------------- New todo input ----------------------------- */}
        <div className="flex items-center gap-[24px] card py-[20px] px-[24px] shadow-none">
          <div className="w-[24px] h-[24px] rounded-full border border-light-gray shrink-0"></div>
          <input
            type="text"
            placeholder="Create a new todo..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
            className="w-full outline-0 text-[18px] tracking-[-0.25px] text-dark-blue placeholder:text-dark-gray line-height leading-none"
          />
        </div>

        {/* -------------------------------- Todo list ------------------------------- */}
        <div className="card mt-[24px]">
          {filteredTodos.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-[24px] py-[20px] px-[24px] border-b border-light-gray last:border-b-0 cursor-move"
              draggable
              onDragStart={(e) => handleDragStart(e, item.id)}
              onDragOver={(e) => handleDragOver(e)}
              onDrop={(e) => handleDrop(e, item.id)}
              onDragEnd={handleDragEnd}
            >
              <button
                className={`${
                  item.completed
                    ? "bg-gradient-to-r from-cyan to-purple"
                    : "bg-white"
                } w-[24px] h-[24px] rounded-full border border-light-gray shrink-0 grid place-items-center`}
                onClick={() => toggleTodo(item.id)}
              >
                {item.completed && (
                  <svg
                    width="11"
                    height="9"
                    viewBox="0 0 11 9"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      id="Path"
                      d="M1 4.3041L3.6959 7L9.6959 1"
                      stroke="white"
                      strokeWidth="2"
                    />
                  </svg>
                )}
              </button>
              <p
                className={`${
                  item.completed
                    ? "text-just-gray strike line-through"
                    : "text-dark-blue"
                } text-[18px]`}
              >
                {item.text}
              </p>
            </div>
          ))}

          {/* ------------------------ Todo list desktop footer ------------------------ */}
          <div className="py-[20px] px-[24px] justify-between text-[14px] text-dark-gray flex">
            <p>{activeTodo} items left</p>
            <div className="gap-[19px] hidden sm:flex">
              <button
                onClick={() => setFilter("all")}
                className={`${
                  filter === "all" && "text-bright-blue"
                } font-bold`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("active")}
                className={`${
                  filter === "active" && "text-bright-blue"
                } font-bold`}
              >
                Active
              </button>
              <button
                onClick={() => setFilter("completed")}
                className={`${
                  filter === "completed" && "text-bright-blue"
                } font-bold`}
              >
                Completed
              </button>
            </div>
            <button onClick={clearCompleted}>Clear Completed</button>
          </div>
        </div>

        {/* ------------------------- Todo list mobile footer ------------------------ */}
        <div className="flex gap-[19px] card mt-[16px] justify-center py-[16px] sm:hidden">
          <button
            onClick={() => setFilter("all")}
            className={`${filter === "all" && "text-bright-blue"} font-bold`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("active")}
            className={`${filter === "active" && "text-bright-blue"} font-bold`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`${
              filter === "completed" && "text-bright-blue"
            } font-bold`}
          >
            Completed
          </button>
        </div>

        <p className="mx-auto mt-[49px] text-dark-gray w-fit">
          Drag and drop to reorder list
        </p>
      </div>
    </main>
  );
}
