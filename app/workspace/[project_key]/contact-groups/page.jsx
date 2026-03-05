"use client"

import { useEffect, useMemo, useState } from "react"
import { api } from "@/lib/api"
import { toast } from "sonner"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Pencil, Trash2 } from "lucide-react"
import Select from "react-select"

export default function ContactGroupsPage() {
  const [groups, setGroups] = useState([])
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)

  const [search, setSearch] = useState("")
  const [formOpen, setFormOpen] = useState(false)
  const [editingGroup, setEditingGroup] = useState(null)

  /* ---------------- FETCH ---------------- */

  const fetchData = async () => {
    try {
      const [groupsRes, contactsRes] = await Promise.all([
        api.get("/api/contact-groups"),
        api.get("/api/contacts"),
      ])

      setGroups(groupsRes.data.data || [])
      setContacts(contactsRes.data.data || [])
    } catch (err) {
      toast.error("Failed to load groups")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  /* ---------------- FILTER ---------------- */

  const filteredGroups = useMemo(() => {
    return groups.filter(g =>
      g.name?.toLowerCase().includes(search.toLowerCase())
    )
  }, [groups, search])

  /* ---------------- CRUD ---------------- */

  const handleDelete = async (id) => {
    if (!confirm("Delete this group?")) return

    setProcessing(true)
    try {
      await api.delete(`/api/contact-groups/${id}`)
      toast.success("Deleted")
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed")
    } finally {
      setProcessing(false)
    }
  }

  const handleSubmit = async (data) => {
    try {
      if (editingGroup) {
        await api.put(`/api/contact-groups/${editingGroup.id}`, data)
        toast.success("Group updated")
      } else {
        await api.post("/api/contact-groups", data)
        toast.success("Group created")
      }

      setFormOpen(false)
      setEditingGroup(null)
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed")
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin h-6 w-6" />
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Contact Groups</h1>
        <Button
          onClick={() => {
            setEditingGroup(null)
            setFormOpen(true)
          }}
        >
          Create Group
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <Input
            placeholder="Search groups..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0 overflow-x-auto">

          <table className="w-full text-sm">
            <thead className="bg-muted border-b">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Description</th>
                <th className="px-4 py-3 text-left">Contacts</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredGroups.map(group => (
                <tr
                  key={group.id}
                  className="border-b hover:bg-muted/50 transition"
                >
                  <td className="px-4 py-3 font-medium">
                    {group.name}
                  </td>

                  <td className="px-4 py-3">
                    {group.description || "—"}
                  </td>

                  <td className="px-4 py-3">
                    {group.contacts?.length || 0}
                  </td>

                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-3">
                      <Pencil
                        className="h-4 w-4 cursor-pointer"
                        onClick={() => {
                          setEditingGroup(group)
                          setFormOpen(true)
                        }}
                      />
                      <Trash2
                        className="h-4 w-4 cursor-pointer text-red-500"
                        onClick={() => handleDelete(group.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}

              {filteredGroups.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center py-8 text-muted-foreground"
                  >
                    No groups found
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </CardContent>
      </Card>

      {/* Modal */}
      {formOpen && (
        <GroupFormModal
          contacts={contacts}
          initialData={editingGroup}
          onClose={() => setFormOpen(false)}
          onSubmit={handleSubmit}
        />
      )}

    </div>
  )
}

/* ---------------- MODAL ---------------- */

function GroupFormModal({ contacts, initialData, onClose, onSubmit }) {
  const [form, setForm] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    contact_ids: initialData?.contacts?.map(c => c.id) || [],
  })

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-lg p-6 space-y-4">

        <h2 className="text-lg font-semibold">
          {initialData ? "Edit Group" : "Create Group"}
        </h2>

        <Input
          placeholder="Group Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <Textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        {/* Multi Select Contacts */}
        <Select
  isMulti
  options={contacts.map(c => ({
    value: c.id,
    label: `${c.name} (${c.phone})`,
  }))}
  value={contacts
    .filter(c => form.contact_ids.includes(c.id))
    .map(c => ({
      value: c.id,
      label: `${c.name} (${c.phone})`,
    }))}
  onChange={(selected) =>
    setForm({
      ...form,
      contact_ids: selected
        ? selected.map(item => item.value)
        : [],
    })
  }
  className="text-sm"
  classNamePrefix="react-select"
/>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>

          <Button onClick={() => onSubmit(form)}>
            Save
          </Button>
        </div>

      </div>
    </div>
  )
}