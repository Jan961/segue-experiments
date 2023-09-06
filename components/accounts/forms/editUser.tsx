import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { JsConfigPathsPlugin } from 'next/dist/build/webpack/plugins/jsconfig-paths-plugin'

import axios from 'axios'
import { Show, Tour } from '../../../interfaces'
import { forceReload } from '../../../utils/forceReload'
import UserListItem from '../manage-users/userListItem'
import { userService } from '../../../services/user.service'
import { useRouter } from 'next/router'
import ShowPermission from './showPermission'
import GlobalPermissions from './globalPermissions'
import { element } from 'prop-types'
import { loggingService } from '../../../services/loggingService'

const showsTabsEndpoint = () => '/api/shows'
const showPermissionsEndpoint = () => '/api/account/read/permission/showPermissions'
const globalPermissionsEndpoint = () => '/api/account/read/permission/globalPermissions'
const accountPermissionsEndpoint = () => '/api/account/read/permission/accountPermissions'

const userPermissionsEndpoint = (userid) => `/api/users/read/permissions/all/${userid}`

export default function EditUser (userId: any) {
  const [tabs, setTabs] = useState([])
  const [defaultShowPermissions, setShowDefaultPermissions] = useState([])
  const [defaultGlobalPermissions, setGlobalDefaultPermissions] = useState([])
  const [defaultAccountPermissions, setAccountDefaultPermissions] = useState([])
  const [permissions, setPermissions] = useState<Tour[]>([])
  const [user, setUser] = useState(userService.userValue)
  const [editUser, setEditUser] = useState()
  const [isLoading, setLoading] = useState(false)
  const [inputs, setInputs] = useState({
    name: { id: 'Name', name: 'Name', defaultValue: 'name', checked: null },
    email: { id: 'Email', name: '', defaultValue: 'false', checked: null }
  }

  )
  const loadedPermissions = []

  const router = useRouter()

  useEffect(() => {
    setLoading(true)
    /**
         * Get Shows
         */
    fetch(showsTabsEndpoint())
      .then(res => res.json())
      .then(res => {
        // Create a tab for each Show (Only non archived)
        setTabs(res.searchResults)
      })
    fetch(showPermissionsEndpoint())
      .then(res => res.json())
      .then(res => {
        setShowDefaultPermissions(res.searchResults)
        for (const permissionInput of res.searchResults) {
          for (const tab in tabs) {
            // format is ShowId_PermissionId == 1_23
            // @ts-ignore
            const permissionTitle = tab.ShowId.toString() + '_' + permissionInput
            const newPermission = { permissionTitle: { id: permissionTitle, name: permissionTitle, defaultValue: false, checked: false } }
            setInputs((prevStatus) => ({ ...prevStatus, ...newPermission }))
          }
        }
      })
    fetch(accountPermissionsEndpoint())
      .then(res => res.json())
      .then(res => {
        setAccountDefaultPermissions(res.searchResults)
        for (const permissionInput of res.searchResults) {
          const newPermission = { permissionTitle: { id: permissionInput, name: permissionInput, defaultValue: false, checked: false } }
          setInputs((prevStatus) => ({ ...prevStatus, ...newPermission }))
        }
      })
    fetch(globalPermissionsEndpoint())
      .then(res => res.json())
      .then(res => {
        setGlobalDefaultPermissions(res.searchResults)
        for (const permissionInput of res.searchResults) {
          const newPermission = { permissionTitle: { id: permissionInput, name: permissionInput, defaultValue: false, checked: false } }
          setInputs((prevStatus) => ({ ...prevStatus, ...newPermission }))
        }
      })

    /**
         * Get Users Persmision
         *
         */
    fetch(userPermissionsEndpoint(userId.UserId))
      .then(res => res.json())
      .then(res => {
        for (const permissionInput of res.searchResults) {
          // alert(JSON.stringify(permissionInput))
          if (permissionInput.Shows === null) {
            // This is an Admin or Global Permission
            const permission = permissionInput.PermissionId
            // setInputs((prevStatus) => ({...prevStatus, permission: true}))
            const newPermission = { permission: { id: permission.toString(), name: permission.toString(), defaultValue: false, checked: false } }
            setInputs((prevStatus) => ({ ...prevStatus, ...newPermission }))
          } else {
            // This is a Show Permission

            const permissionTitle: string = permissionInput.Shows + '_' + permissionInput.PermissionId

            const userPermissionsEndpoint = (userid) => `/api/users/read/permissions/all/${userid}`

            const newPermission = undefined// {id: {id: permissionTitle.toString(), name: permission.toString(), defaultValue: false, checked:false}}
            setInputs((prevStatus) => ({ ...prevStatus, ...newPermission }))
          }

          var i, tabcontent, tablinks

          // Get all elements with class="tabcontent" and hide them
          tabcontent = document.getElementsByClassName('tabcontent')
          for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = 'none'
          }
          // Only set not loading once the grid has been populated

          setLoading(false)
        }
      })
  }, [])

  const [showModal, setShowModal] = React.useState(false)

  const [status, setStatus] = useState({
    submitted: false,
    submitting: false,
    info: { error: false, msg: null }
  })

  const handleServerResponse = (ok, msg) => {
    if (ok) {
      setStatus({
        submitted: true,
        submitting: false,
        info: { error: false, msg }
      })
      // setInputs({});
    } else {
      // @ts-ignore
      setStatus(false)
    }
  }
  const handleOnChange = (e) => {
    e.persist()

    // alert(e.target.name +" " + e.target.checked)
    if (e.target.checked !== null) {
      e.target.value = e.target.checked
    }
    setInputs((prev) => ({
      ...prev,
      [e.target.id]: e.target.value
    }))
    setStatus({
      submitted: false,
      submitting: false,
      info: { error: false, msg: null }
    })
  }
  const handleOnSubmit = async (e) => {
    e.preventDefault()
    setStatus((prevStatus) => ({ ...prevStatus, submitting: true }))

    axios({
      method: 'POST',
      url: '/api/users/update',
      data: inputs
    })
      .then((response) => {
        loggingService.logAction('Update User', 'update User: ' + userId)
        handleServerResponse(
          true,
          'Thank you, your message has been submitted.'
        )
        handleClose()
      })
      .catch((error) => {
        handleServerResponse(false, error.response.data.error)
      })
  }

  const handleClose = () => {
    setShowModal(false)
    forceReload()
  }

  // alert(JSON.stringify(inputs))
  function openTab (evt, Name) {
    // Declare all variables
    let i, tabcontent, tablinks

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName('tabcontent')
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = 'none'
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName('tablinks')
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(' active', '')
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(Name).style.display = 'block'
    evt.currentTarget.className += ' active'
  }

  return (
    <>
      <button
        className="bg-blue-600 text-white hover:bg-blue-400 active:bg-blue-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
        type="button"
        onClick={() => setShowModal(true)}
      >
                Edit
      </button>
      {showModal ? (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none overflow-scroll"
          >
            <div className="relative w-auto my-6 mx-auto max-w-6xl">
              {/* content */}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/* header */}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold">
                                        Edit User
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      x
                    </span>
                  </button>
                </div>
                {/* body */}
                <form onSubmit={handleOnSubmit}>
                  <div className="relative p-6 flex-auto">
                    <div className="grid grid-cols-1 gap-2">
                      <div>
                        <p className={'text-gray-700 font-medium' }>Update User</p>
                        <p className={'text-gray-600 small' }>
                                                    Changes to the user will update on the next login
                        </p>
                      </div>
                      <div>
                        <label htmlFor="Name" className="">Name</label>

                        <input id="Name"
                          type="text"
                          name="name"
                          onChange={handleOnChange}
                          required
                          value={JSON.stringify(inputs)}
                          className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder="Jo Bloggs"
                          contentEditable={false}
                        />

                      </div>
                      <div>
                        <label htmlFor="emailAddress" className="">Email Address</label>
                        <input id="emailAddress"
                          type="email"
                          name="emailAddress"
                          onChange={handleOnChange}
                          required
                          value={inputs.email.defaultValue}
                          className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"

                        />
                      </div>

                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      <div>
                        <p className={'text-gray-700 small' }>Capabilities</p>
                      </div>
                    </div>
                    <div className="grid justify-items-stretch">
                      <div>
                        <div className="tab">
                          {tabs.map((tab) => (
                            <>
                              <button
                                type="button"
                                className="justify-self-auto items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 overflow-hidden  overflow-ellipsis "
                                onClick={() => openTab(event, tab.Name)}>{tab.Name}

                              </button>

                            </>
                          ))}
                          <button
                            type="button"
                            className="justify-self-auto items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 overflow-hidden  overflow-ellipsis "
                            onClick={() => openTab(event, 'Account Management')}>{'Account Management'}

                          </button>
                          <button
                            type="button"
                            className="justify-self-auto items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 overflow-hidden  overflow-ellipsis "
                            onClick={() => openTab(event, 'Segue Management')}>{'Segue Management'}

                          </button>
                        </div>

                        {tabs.map((tab) => (
                          <>

                            <div id={tab.Name} className="tabcontent hidden">
                              <h3>{tab.Name}</h3>
                              {defaultShowPermissions.map((permission) => (

                                <div className={'grid grid-cols-3'} >

                                  <input
                                    type={'checkbox'}
                                    id={`${tab.ShowId}_${permission.PermissionId}`}
                                    name={`${tab.ShowId}_${permission.PermissionId}`}
                                    onChange={handleOnChange}

                                    // checked={permission.permission.id.checked}
                                  />
                                  <label htmlFor={[tab.ShowId][permission.PermissionId] }>{permission.Title}</label>

                                </div>
                              ))}
                            </div>
                          </>
                        ))}

                        <div id="Account Management" className="tabcontent ">
                          <h3>Account Management</h3>

                          {defaultAccountPermissions.map((permission) => (
                            <div className={'grid grid-cols-3'} >
                              <input
                                type={'checkbox'}
                                id={`${permission.PermissionId}`}
                                name={`${permission.PermissionId}`}
                                onChange={handleOnChange}
                                checked={permission.PermissionId.checked}
                              />
                              <label htmlFor={[permission.PermissionId].toString() }>{permission.Title}</label>

                            </div>
                          ))}

                        </div>

                        <div id="Segue Management" className="tabcontent hidden">
                          <h3>Segue Management</h3>

                          {defaultGlobalPermissions.map((permission) => (
                            <div className={'grid grid-cols-3'} >
                              <input
                                type={'checkbox'}
                                id={`${permission.PermissionId}`}
                                name={`${permission.PermissionId}`}
                                onChange={handleOnChange}
                                checked={permission.PermissionId.checked}
                              />
                              <label htmlFor={[permission.PermissionId].toString() }>{permission.Title}</label>

                            </div>
                          ))}

                        </div>

                      </div>
                    </div>

                  </div>

                  {/* footer */}
                  <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                    <button
                      className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => setShowModal(false)}
                      // THis will not save anything and discard the form
                    >

                                            Close and Discard
                    </button>
                    <button
                      className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="submit" disabled={status.submitting}>
                      {!status.submitting
                        ? !status.submitted
                          ? 'Submit'
                          : 'Submitted'
                        : 'Submitting...'}
                    </button>
                  </div></form>

              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  )
}
