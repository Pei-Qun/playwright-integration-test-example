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

  const { data, error } = useQuery<User>({
    queryKey: ["user", userIdSearch],
    queryFn: async () => {
      const res = await fetch(`/api/user/${userIdSearch}`);
      if (!res.ok) {
        throw new Error("User not found");
      }
      return res.json();
    },
    retry: false,
  });

  const { mutate } = useMutation<User, unknown, Omit<User, "id">>({
    mutationFn: (user) =>
      fetch("/api/user", { method: "POST", body: JSON.stringify(user) }).then(
        (res) => res.json()
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  const handleOnCreate = () => {
    mutate({ name: "New User", email: "new.user@email.com" });
  };

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
      {error && <p>{error.message}</p>}
      <button onClick={handleOnCreate}>Create</button>
    </>
  );
}

export default App;
