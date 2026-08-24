import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  MagnifyingGlassIcon,
  UsersIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  TrashIcon,
  EyeIcon,
  ArrowLeftIcon
} from "@heroicons/react/24/outline";

import { STATUSES } from "../globals/misc/statuses";
import Loader from "../globals/loader/loader";

import {
  getAllUsers,
  deleteUser,
} from "../store/userSlice";
import { Link } from "react-router-dom";


export default function ManageUsers() {

  const dispatch = useDispatch();

  const {
    users = [],
    status,
  } = useSelector((state) => state.user);


  const [search, setSearch] = useState("");


  // =========================================
  // FETCH USERS
  // =========================================

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);


  // =========================================
  // SEARCH
  // =========================================

  const filteredUsers = useMemo(() => {

    if (!search.trim()) {
      return users;
    }

    const value = search.toLowerCase().trim();

    return users.filter((user) => {

      return (
        user.user_Name
          ?.toLowerCase()
          .includes(value) ||

        user.user_Email
          ?.toLowerCase()
          .includes(value) ||

        String(user.user_Phone || "")
          .includes(value)
      );

    });

  }, [users, search]);


  // =========================================
  // DELETE
  // =========================================

  const handleDelete = async (id, name) => {

    const confirmed = window.confirm(
      `Are you sure you want to delete ${name}?`
    );

    if (!confirmed) return;

    await dispatch(deleteUser(id));
  };


  // LOADING

  if (status === STATUSES.LOADING && users.length === 0) {

    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader message="Loading users wait...."/>
      </div>
    );

  }


  return (
    <main className="min-h-screen bg-slate-50 px-4 md:px-8 py-10">

      <div className="max-w-7xl mx-auto">

        <Link
          to="/admin/dashboard"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Dashboard
        </Link>


{/* //HEADER */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">

          <div>

            <h1 className="mt-1 text-3xl md:text-4xl font-bold text-slate-900">
              Users
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Manage customers registered on IshShop.
            </p>

          </div>


          {/* Total */}

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center">

              <UsersIcon className="w-6 h-6 text-blue-600" />

            </div>

            <div>

              <p className="text-xs text-slate-500">
                Total Customers
              </p>

              <p className="text-xl font-bold text-slate-900">
                {users.length}
              </p>

            </div>

          </div>

        </div>


        {/* =====================================
            SEARCH
        ===================================== */}

        <div className="mt-8 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">

          <div className="relative">

            <MagnifyingGlassIcon
              className="absolute left-4 top-1/2 -translate-y-1/2
              w-5 h-5 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email or phone..."
              className="
                w-full h-12
                pl-11 pr-4
                rounded-xl
                border border-slate-200
                bg-slate-50
                text-sm
                text-slate-900
                placeholder:text-slate-400
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
              "
            />

          </div>

        </div>


        {/* =====================================
            USERS TABLE
        ===================================== */}

        <div className="mt-6 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="bg-slate-50 border-b border-slate-200 text-left">

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    User
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Email
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Phone
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Role
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Joined
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500 text-right">
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody className="divide-y divide-slate-100">

                {filteredUsers.length > 0 ? (

                  filteredUsers.map((user) => (

                    <tr
                      key={user._id}
                      className="hover:bg-slate-50 transition"
                    >

                      {/* USER */}

                      <td className="px-6 py-4">

                        <div className="flex items-center gap-3">

                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">

                            <UserIcon className="w-5 h-5 text-blue-600" />

                          </div>

                          <div>

                            <p className="text-sm font-semibold text-slate-900">
                              {user.user_Name}
                            </p>

                            <p className="text-xs text-slate-400">
                              #{user._id.slice(-7)}
                            </p>

                          </div>

                        </div>

                      </td>


                      {/* EMAIL */}

                      <td className="px-6 py-4">

                        <div className="flex items-center gap-2">

                          <EnvelopeIcon className="w-4 h-4 text-slate-400" />

                          <span className="text-sm text-slate-700">
                            {user.user_Email}
                          </span>

                        </div>

                      </td>


                      {/* PHONE */}

                      <td className="px-6 py-4">

                        <div className="flex items-center gap-2">

                          <PhoneIcon className="w-4 h-4 text-slate-400" />

                          <span className="text-sm text-slate-700">
                            {user.user_Phone}
                          </span>

                        </div>

                      </td>


                      {/* ROLE */}

                      <td className="px-6 py-4">

                        <span className="inline-flex px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                          {user.user_Role}
                        </span>

                      </td>


                      {/* JOINED */}

                      <td className="px-6 py-4">

                        <span className="text-sm text-slate-600">

                          {new Date(
                            user.createdAt
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}

                        </span>

                      </td>


                      {/* ACTIONS */}

                      <td className="px-6 py-4">

                        <div className="flex items-center justify-end gap-2">

                          <button
                            className="
                              p-2 rounded-lg
                              text-slate-500
                              hover:text-blue-600
                              hover:bg-blue-50
                              transition
                            "
                            title="View User"
                          >
                            <EyeIcon className="w-5 h-5" />
                          </button>


                          <button
                            onClick={() =>
                              handleDelete(
                                user._id,
                                user.user_Name
                              )
                            }
                            className="
                              p-2 rounded-lg
                              text-slate-500
                              hover:text-red-600
                              hover:bg-red-50
                              transition
                            "
                            title="Delete User"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>

                    <td
                      colSpan="6"
                      className="px-6 py-16 text-center"
                    >

                      <UsersIcon className="mx-auto w-10 h-10 text-slate-300" />

                      <h2 className="mt-4 text-lg font-semibold text-slate-900">
                        No users found
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        Try changing your search.
                      </p>

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>


      </div>

    </main>
  );
}