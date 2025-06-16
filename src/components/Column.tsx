import React, { useState } from 'react';
import Task from './Task';
import { useDrop } from 'react-dnd'; // Добавлено!
import { TaskType, ColumnType } from '../App';

type Props = {
    column: ColumnType;
    tasks: TaskType[];
    moveTask: (taskId: string, fromColumnId: string, toColumnId: string) => void;
    addTask: (content: string, columnId: string) => void;
    removeTask: (taskId: string, columnId: string) => void;
    editTask: (taskId: string, newContent: string) => void;
    removeColumn: (columnId: string) => void;
};

const Column: React.FC<Props> = ({
                                     column,
                                     tasks,
                                     moveTask,
                                     addTask,
                                     removeTask,
                                     editTask,
                                     removeColumn,
                                 }) => {
    const [showInput, setShowInput] = useState(false);
    const [inputValue, setInputValue] = useState('');

    // Вот это - добавляем чтобы колонка принимала таски при перетаскивании
    const [, drop] = useDrop({
        accept: 'TASK',
        drop: (item: any) => {
            if (item.fromColumnId !== column.id) {
                moveTask(item.id, item.fromColumnId, column.id);
                item.fromColumnId = column.id; // Обновляем источник, чтобы избежать лишних вызовов
            }
        },
    });

    const handleAddTask = () => {
        if (!inputValue.trim()) {
            alert('Die Aufgabe darf nicht leer sein.');
            return;
        }
        addTask(inputValue.trim(), column.id);
        setInputValue('');
        setShowInput(false);
    };

    const handleRemoveColumn = () => {
        if (
            window.confirm(
                `Spalte löschen "${column.title}"? Alle Aufgaben werden gelöscht!`
            )
        ) {
            removeColumn(column.id);
        }
    };

    return (
        <div
            ref={drop} // вот тут передаем реф для droppable области
            style={{
                backgroundColor: '#f0f0f0',
                borderRadius: 8,
                padding: 12,
                minHeight: 300,
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 12,
                }}
            >
                <h3>{column.title}</h3>
                <button
                    onClick={handleRemoveColumn}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'red',
                        fontSize: 20,
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        lineHeight: 1,
                    }}
                    title="Spalte löschen"
                >
                    ×
                </button>
            </div>

            <div style={{ flexGrow: 1, overflowY: 'auto' }}>
                {tasks.map((task, index) => (
                    <Task
                        key={task.id}
                        task={task}
                        index={index}
                        columnId={column.id}
                        removeTask={removeTask}
                        editTask={editTask}
                        moveTask={moveTask}
                    />
                ))}
            </div>

            {showInput ? (
                <>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Neue Aufgabe"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAddTask();
                            if (e.key === 'Escape') {
                                setShowInput(false);
                                setInputValue('');
                            }
                        }}
                        style={{ marginTop: 8, padding: 6, width: '100%' }}
                        autoFocus
                    />
                    <div style={{ marginTop: 8, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                        <button onClick={handleAddTask}>Hinzufügen</button>
                        <button
                            onClick={() => {
                                setShowInput(false);
                                setInputValue('');
                            }}
                        >
                            Отмена
                        </button>
                    </div>
                </>
            ) : (
                <button style={{ marginTop: 8 }} onClick={() => setShowInput(true)}>
                    + Добавить задачу
                </button>
            )}
        </div>
    );
};

export default Column;



