import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useMutation,
} from "@tanstack/react-query";
import { useState } from "react";

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Content />
      </QueryClientProvider>
    </>
  );
}

interface User {
  id: number;
  name: string;
  email: string;
}

function Content() {
  const [userIdInput, setUserIdInput] = useState("");
  const [userIdSearch, setUserIdSearch] = useState("");
  const handleSearch = () => {
    setUserIdSearch(userIdInput);
  };

  const { data } = useQuery<User>({
    queryKey: ["user", userIdSearch],
    queryFn: () => fetch(`/api/user/${userIdSearch}`).then((res) => res.json()),
  });
  // const { mutate } = useMutation<User, unknown, User>(
  //   {
  //     mutationFn: (user) => fetch("/api/user", { method: "POST", body: JSON.stringify(user) }).then((res) => res.json()),
  //     onSuccess: () => {
  //       queryClient.invalidateQueries("user");
  //     },
  //   }
  // )

  const handleOnCreate = () => {};

  return (
    <>
      <label htmlFor="name">User Id Search</label>
      <input
        type="text"
        id="name"
        value={userIdInput}
        onChange={(e) => setUserIdInput(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      <p>User Info</p>
      <p>id: {data?.id}</p>
      <p>name: {data?.name}</p>
      <p>email: {data?.email}</p>
      <button onClick={handleOnCreate}>Create</button>
    </>
  );
}

export default App;
