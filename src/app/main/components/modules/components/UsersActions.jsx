import React from "react";
import UsersEditAction from "./UsersEditAction";
import UsersDetailsAction from "./UsersDetailsAction";
import UsersDeleteAction from "./UsersDeleteAction";
export default function UsersActions({
  closeThisModal,
  action,
  rows,
  setSelectedRows,
}) {
  switch (action) {
    case "edit":
      return (
        <UsersEditAction
          closeThisModal={closeThisModal}
          users={rows}
          setSelectedRows={setSelectedRows}
        />
      );
    case "details":
      return (
        <UsersDetailsAction closeThisModal={closeThisModal} users={rows} />
      );
    case "delete":
      return (
        <UsersDeleteAction
          closeThisModal={closeThisModal}
          users={rows}
          setSelectedRows={setSelectedRows}
        />
      );
    default:
      return null;
  }
}
