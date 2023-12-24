import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useMutation,
} from "@tanstack/react-query";

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
  const { data } = useQuery<User>({
    queryKey: ["user"],
    queryFn: () => fetch("/api/user").then((res) => res.json()),
  });
  // const { mutate } = useMutation<User, unknown, User>(
  //   {
  //     mutationFn: (user) => fetch("/api/user", { method: "POST", body: JSON.stringify(user) }).then((res) => res.json()),
  //     onSuccess: () => {
  //       queryClient.invalidateQueries("user");
  //     },
  //   }
  // )

  const handleOnClick = () => {};

  return (
    <>
      <p>User Info</p>
      <p>id: {data?.id}</p>
      <p>name: {data?.name}</p>
      <p>email: {data?.email}</p>
      <button onClick={handleOnClick}>Click</button>
    </>
  );
}

export default App;
