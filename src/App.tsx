import './App.css'
import {useEffect, useMemo, useRef, useState} from "react";
import {Login, SortBy, User, Users} from "./models/Users.d";
import UsersList from "./components/UsersList.tsx";

function App() {
  const [users, setUsers] = useState<Users>([])
  const [rowColor, setRowColor] = useState<boolean>(false)
  const [orderBy, setOrderBy] = useState<SortBy>(SortBy.NONE)
  const [filterByCountry, setFilterByCountry] = useState<string | null>(null)
  const initialUsers = useRef<Users>([])

  useEffect(() => {
    fetch('https://randomuser.me/api/?results=100', {method: 'GET'}).then(async response => response.json()).then(({results}) => {
      setUsers(results)
      initialUsers.current = results
    })
  }, [])

  const deleteUser = (id: Login['uuid']) => {
    const filteredUsers = users.filter((user) => user.login.uuid !== id)
    setUsers(filteredUsers)
  }

  const resetStatus = () => {
    setUsers(initialUsers.current)
  }

  const handleSorting = (sortBy: SortBy) => {
    setOrderBy(sortBy)
  }

  const setOrderByCountry = () => {
    orderBy === SortBy.NONE ? setOrderBy(SortBy.COUNTRY) : setOrderBy(SortBy.NONE)
  }

  const usersSortedByField = useMemo(() => {
    if (orderBy === SortBy.NONE) return users
    const orderProperties: Record<string, (user: User) => any > = {
      [SortBy.FIRST]: (user) => user.name.first,
      [SortBy.LAST]: (user) => user.name.last,
      [SortBy.COUNTRY]: (user) => user.location.country
    }
    return users.toSorted((userA, userB) => {
      const currentProperty = orderProperties[orderBy]
      return currentProperty(userA).toLowerCase().localeCompare(currentProperty(userB).toLowerCase())
    })
  }, [orderBy, users])

  const usersFilteredByCountry = useMemo(() => {
    return filterByCountry ? usersSortedByField.filter((user) => user.location.country.toLowerCase().includes(filterByCountry.toLowerCase())) : usersSortedByField
  }, [filterByCountry, usersSortedByField])

  return (
    <div className='app-wrapper'>
      <div className="title-wrapper">
        <span>Technical test react</span>
      </div>
      <div className="actions-wrapper">
        <button onClick={() => setRowColor(!rowColor)}>Color rows</button>
        <button
          onClick={() => setOrderByCountry()}>{orderBy === SortBy.NONE ? 'Sort by country' : 'Do not sort'}</button>
        <button onClick={() => resetStatus()}>Reset deleted users</button>
        <input type="text" placeholder='Filter by country...'
               onChange={(event) => setFilterByCountry(event.target.value)}/>
      </div>
      <UsersList users={usersFilteredByCountry} deleteUser={deleteUser} rowColor={rowColor} changeSorting={handleSorting} />
    </div>
  )
}

export default App
