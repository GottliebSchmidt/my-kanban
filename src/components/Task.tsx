import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { TaskType } from '../App';

type Props = {
    task: TaskType;
    index: number;
    columnId: string;
    removeTask: (taskId: string, columnId: string) => void;
    editTask: (taskId: string, newContent: string) => void;
    moveTask: (taskId: string, fromColumnId: string, toColumnId: string) => void;
};

const Task: React.FC<Props> = ({
                                   task,
                                   index,
                                   columnId,
                                   removeTask,
                                   editTask,
                               }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'TASK',
        item: { id: task.id, fromColumnId: columnId, index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }));

    const [editMode, setEditMode] = useState(false);
    const [newContent, setNewContent] = useState(task.content);

    const handleDelete = () => {
        if (window.confirm('Удалить задачу?')) {
            removeTask(task.id, columnId);
        }
    };

    const handleSave = () => {
        if (!newContent.trim()) {
            alert('Содержимое задачи не может быть пустым!');
            return;
        }
        editTask(task.id, newContent.trim());
        setEditMode(false);
    };

    return (
        <div
            ref={drag}
            style={{
                opacity: isDragging ? 0.5 : 1,
                padding: 10,
                marginBottom: 10,
                backgroundColor: 'white',
                border: '1px solid #ccc',
                borderRadius: 6,
                cursor: 'move',
                position: 'relative',
            }}
        >
            {editMode ? (
                <>
                    <input
                        value={newContent}
                        onChange={(e) => setNewContent(e.target.value)}
                        autoFocus
                        style={{ width: '100%', padding: 6 }}
                    />
                    <div
                        style={{
                            marginTop: 6,
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: 8,
                        }}
                    >
                        <button onClick={handleSave}>💾 Сохранить</button>
                        <button onClick={() => setEditMode(false)}>✖ Отмена</button>
                    </div>
                </>
            ) : (
                <>
                    <p>{task.content}</p>
                    <div
                        style={{
                            position: 'absolute',
                            top: 6,
                            right: 8,
                            display: 'flex',
                            gap: 8,
                        }}
                    >
                        <button
                            onClick={() => setEditMode(true)}
                            title="Редактировать"
                            style={{ padding: '2px 6px' }}
                        >
                            ✏️
                        </button>
                        <button
                            onClick={handleDelete}
                            title="Удалить"
                            style={{ padding: '2px 6px', color: 'red', fontWeight: 'bold' }}
                        >
                            ×
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Task;