import React, { useState, useEffect } from 'react';
import Column from './components/Column';

export type TaskType = {
    id: string;
    content: string;
};

export type ColumnType = {
    id: string;
    title: string;
    taskIds: string[];
};

type DataType = {
    tasks: Record<string, TaskType>;
    columns: Record<string, ColumnType>;
    columnOrder: string[];
};

const initialData: DataType = {
    tasks: {
        'task-1': { id: 'task-1', content: 'Brot kaufen' },
        'task-2': { id: 'task-2', content: 'React lernen' },
        'task-3': { id: 'task-3', content: 'Fahrrad reparieren' },
    },
    columns: {
        'column-1': {
            id: 'column-1',
            title: 'To Do',
            taskIds: ['task-1', 'task-2'],
        },
        'column-2': {
            id: 'column-2',
            title: 'In Progress',
            taskIds: ['task-3'],
        },
        'column-3': {
            id: 'column-3',
            title: 'Done',
            taskIds: [],
        },
    },
    columnOrder: ['column-1', 'column-2', 'column-3'],
};

function App() {
    const savedData = localStorage.getItem('kanbanData');
    const [data, setData] = useState<DataType>(
        savedData ? JSON.parse(savedData) : initialData
    );
    const [newColumnTitle, setNewColumnTitle] = useState('');

    useEffect(() => {
        localStorage.setItem('kanbanData', JSON.stringify(data));
    }, [data]);

    const moveTask = (
        taskId: string,
        fromColumnId: string,
        toColumnId: string
    ) => {
        if (fromColumnId === toColumnId) return;

        setData((prev) => {
            const fromColumn = prev.columns[fromColumnId];
            const toColumn = prev.columns[toColumnId];

            const newFromTaskIds = fromColumn.taskIds.filter((id) => id !== taskId);
            const newToTaskIds = [...toColumn.taskIds, taskId];

            return {
                ...prev,
                columns: {
                    ...prev.columns,
                    [fromColumnId]: {
                        ...fromColumn,
                        taskIds: newFromTaskIds,
                    },
                    [toColumnId]: {
                        ...toColumn,
                        taskIds: newToTaskIds,
                    },
                },
            };
        });
    };

    const addTask = (content: string, columnId: string) => {
        const newTaskId = `task-${Date.now()}`;
        const newTask = { id: newTaskId, content };

        setData((prev) => ({
            ...prev,
            tasks: {
                ...prev.tasks,
                [newTaskId]: newTask,
            },
            columns: {
                ...prev.columns,
                [columnId]: {
                    ...prev.columns[columnId],
                    taskIds: [...prev.columns[columnId].taskIds, newTaskId],
                },
            },
        }));
    };

    const removeTask = (taskId: string, columnId: string) => {
        setData((prev) => {
            const newTasks = { ...prev.tasks };
            delete newTasks[taskId];

            const newTaskIds = prev.columns[columnId].taskIds.filter(
                (id) => id !== taskId
            );

            return {
                ...prev,
                tasks: newTasks,
                columns: {
                    ...prev.columns,
                    [columnId]: {
                        ...prev.columns[columnId],
                        taskIds: newTaskIds,
                    },
                },
            };
        });
    };

    const editTask = (taskId: string, newContent: string) => {
        setData((prev) => ({
            ...prev,
            tasks: {
                ...prev.tasks,
                [taskId]: {
                    ...prev.tasks[taskId],
                    content: newContent,
                },
            },
        }));
    };

    const addColumn = (title: string) => {
        const newColumnId = `column-${Date.now()}`;
        const newColumn = {
            id: newColumnId,
            title,
            taskIds: [],
        };

        setData((prev) => ({
            ...prev,
            columns: {
                ...prev.columns,
                [newColumnId]: newColumn,
            },
            columnOrder: [...prev.columnOrder, newColumnId],
        }));
    };

    const removeColumn = (columnId: string) => {
        setData((prev) => {
            const newColumns = { ...prev.columns };
            delete newColumns[columnId];

            const newColumnOrder = prev.columnOrder.filter((id) => id !== columnId);

            // Remove tasks from deleted column
            const taskIdsToRemove = prev.columns[columnId].taskIds;
            const newTasks = { ...prev.tasks };
            taskIdsToRemove.forEach((taskId) => {
                delete newTasks[taskId];
            });

            return {
                ...prev,
                columns: newColumns,
                columnOrder: newColumnOrder,
                tasks: newTasks,
            };
        });
    };

    return (
        <div style={{ display: 'flex', gap: 20, padding: 20, overflowX: 'auto' }}>
            {data.columnOrder.map((columnId) => {
                const column = data.columns[columnId];
                const tasks = column.taskIds
                    .map((taskId) => data.tasks[taskId])
                    .filter((task) => task !== undefined);

                return (
                    <div
                        key={column.id}
                        style={{
                            borderRight:
                                columnId !== data.columnOrder[data.columnOrder.length - 1]
                                    ? '2px solid #ddd'
                                    : 'none',
                            paddingRight: 20,
                            marginRight: 20,
                            minWidth: 250,
                        }}
                    >
                        <Column
                            column={column}
                            tasks={tasks}
                            moveTask={moveTask}
                            addTask={addTask}
                            removeTask={removeTask}
                            editTask={editTask}
                            removeColumn={removeColumn}
                        />
                    </div>
                );
            })}
            <div style={{ minWidth: 250, padding: 20 }}>
                <input
                    type="text"
                    placeholder="Name der neuen Spalte"
                    value={newColumnTitle}
                    onChange={(e) => setNewColumnTitle(e.target.value)}
                    style={{ width: '100%', padding: '6px', marginBottom: '8px' }}
                />
                <button
                    onClick={() => {
                        if (newColumnTitle.trim()) {
                            addColumn(newColumnTitle.trim());
                            setNewColumnTitle('');
                        }
                    }}
                    style={{ width: '100%', padding: '8px' }}
                >
                    + Spalte hinzufügen
                </button>
            </div>
        </div>
    );
}

export default App;
