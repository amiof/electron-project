import "./App.scss";
import { Button, HStack } from "@chakra-ui/react";

function App() {
  return (
    <div>
      <HStack>
        <Button size={"2xl"} style={{ color: "red" }} css={{ bg: "green.500" }}>
          Click me
        </Button>
        <Button disabled={true}>Click me</Button>
      </HStack>
      <div className={"bg-amber-700"}> this is tailwindcss</div>
      <div className={"text text-yellow-400"}>this is a test</div>
    </div>
  );
}

export default App;
