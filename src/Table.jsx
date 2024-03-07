import React from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import PropTypes from "prop-types";

const Table = () => {
  const [students, setStudents] = React.useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      contact: "1234567890",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      contact: "9876543210",
    },
    {
      id: 3,
      name: "Bob Johnson",
      email: "bob@example.com",
      contact: "5555555555",
    },
  ]);

  const handleInputChange = (event, id, field) => {
    const { value } = event.target;

    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.id === id ? { ...student, [field]: value } : student
      )
    );
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = students.findIndex(
        (student) => student.id === active.id
      );
      const newIndex = students.findIndex((student) => student.id === over.id);

      setStudents((prevStudents) => {
        const newStudents = [...prevStudents];
        const [movedItem] = newStudents.splice(oldIndex, 1);
        newStudents.splice(newIndex, 0, movedItem);
        return newStudents;
      });
    }
  };

  return (
    <DndContext
      sensors={useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor))}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={students.map((student) => student.id)}
        strategy={rectSortingStrategy}
      >
        <div className="table-container">
          <h1 className="table-heading">Student Data</h1>
          <hr className="table-divider" />
          <table className="student-table">
            <thead>
              <tr>
                <th className="table-header">Move</th>
                <th className="table-header">Student Name</th>
                <th className="table-header">Email</th>
                <th className="table-header">Contact</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <Student
                  key={student.id}
                  {...student}
                  onChange={handleInputChange}
                />
              ))}
            </tbody>
          </table>
        </div>
      </SortableContext>
    </DndContext>
  );
};

const Student = ({ id, name, email, contact, onChange }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  return (
    <tr
      key={id}
      className="student-row"
      ref={setNodeRef}
      style={{
        transform: transform
          ? `translate(${transform.x}px, ${transform.y}px)`
          : "",
        transition,
      }}
      {...attributes}
      {...listeners}
    >
      <td className="table-data">
        <button className="move-button">Move</button>
      </td>
      <td className="table-data">
        <input
          disabled
          required
          type="text"
          placeholder="Student Name"
          value={name}
          className="student-input"
          onChange={(event) => onChange(event, id, "name")}
        />
      </td>
      <td className="table-data">
        <input
          disabled
          required
          type="email"
          placeholder="Email"
          value={email}
          className="student-input"
          onChange={(event) => onChange(event, id, "email")}
        />
      </td>
      <td className="table-data">
        <input
          disabled
          required
          type="text"
          placeholder="Contact"
          value={contact}
          className="student-input"
          onChange={(event) => onChange(event, id, "contact")}
        />
      </td>
    </tr>
  );
};
Student.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  contact: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Table;
