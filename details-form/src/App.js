import {
  Routes,
  Route
} from "react-router-dom";

import { DetailsComponents, FormComponent } from './container';

function App() {
  return (
    <Routes>
      <Route element={<FormComponent />} path='/' exact />
      <Route element={<DetailsComponents />} path='/details/:id' exact />
    </Routes>
  );
}

export default App;
