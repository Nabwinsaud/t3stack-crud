import {
  Button,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React, { SetStateAction } from "react";
import { Todo } from "~/schema/todo.schema";

export interface TodoProps extends Todo {
  id: string;
}

interface ShowTodosProps {
  todos: TodoProps[] | undefined;
  setTodo: React.Dispatch<SetStateAction<TodoProps | null>>;
  onOpen: () => void;
  setDeletedId: (id: string | null) => void;
  onOpenDelete: () => void;
}
export default function ShowTodos({
  todos,
  setTodo,
  onOpen,
  setDeletedId,
  onOpenDelete,
}: ShowTodosProps) {
  return (
    <div>
      <TableContainer className="box-shadow-md my-4 rounded-sm border px-2 py-2">
        <Table className="rounded-sm border-slate-500">
          <Thead>
            <Tr>
              <Th>Sn</Th>
              <Th>Title</Th>
              <Th>Description</Th>
              <Th>Is Active</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {todos?.map((todo, index) => (
              <Tr key={index}>
                <Td>{index + 1}</Td>
                <Td>{todo.title}</Td>
                <Td>{todo.description}</Td>
                <Td>{todo?.isActive ? "✅" : "❌"}</Td>
                <Td className="space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setTodo(todo);
                      onOpen();
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => {
                      onOpenDelete();
                      setDeletedId(todo.id);
                    }}
                    colorScheme="red"
                    size="sm"
                  >
                    Delete
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </div>
  );
}
