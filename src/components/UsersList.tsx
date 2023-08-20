import {Login, Users} from "../models/Users";
import {SortBy} from "../models/Users.d";

interface Props {
  users: Users
  deleteUser: (id: Login['uuid']) => void
  rowColor: boolean
  changeSorting: (sortBy: SortBy) => void
}
const UsersList = ({users, deleteUser, rowColor, changeSorting}: Props) => {

  return (
    <table width='100%'>
      <thead>
      <tr>
        <th>Photo</th>
        <th onClick={() => changeSorting(SortBy.FIRST)} className='sort'>Name</th>
        <th onClick={() => changeSorting(SortBy.LAST)} className='sort'>Surname</th>
        <th onClick={() => changeSorting(SortBy.COUNTRY)} className='sort'>Country</th>
        <th>Actions</th>
      </tr>
      </thead>
      <tbody className={`${rowColor ? "color" : ""}`}>
      {users.map((user) => {
        return <tr key={user.login.uuid}>
          <td>
            <img src={user.picture.thumbnail} alt='User picture'/>
          </td>
          <td>
            <span>{user.name.first}</span>
          </td>
          <td>
            <span>{user.name.last}</span>
          </td>
          <td>
            <span>{user.location.country}</span>
          </td>
          <td>
            <button onClick={() => deleteUser(user.login.uuid)}>Remove</button>
          </td>
        </tr>
      })}
      </tbody>
    </table>
  )
}

export default UsersList