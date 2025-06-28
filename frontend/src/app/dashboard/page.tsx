"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Dialog, DialogBackdrop, DialogPanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import SequenceList from '../components/SequenceList';

const navigation = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Sequences', href: '/dashboard/sequences' },
  { name: 'Templates', href: '/dashboard/templates' },
  { name: 'Profile', href: '/profile' },
];
const userNavigation = [
  { name: 'Your Profile', href: '/profile' },
  { name: 'Settings', href: '#' },
  { name: 'Sign out', href: '/logout' },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function DashboardPage() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [sequences, setSequences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  useEffect(() => {
    setHasMounted(true);
    const t = localStorage.getItem('token');
    const u = localStorage.getItem('user');
    if (!t) {
      router.replace('/login');
      return;
    }
    setToken(t);
    setUser(u ? JSON.parse(u) : null);
    // Fetch sequences
    fetch(`${API_URL}/api/sequences`, {
      headers: { Authorization: `Bearer ${t}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setSequences(data.sequences || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [API_URL, router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!hasMounted || !user) return null;

  return (
    <div className="min-h-full">
      <header className="bg-indigo-600 pb-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
          <div className="relative flex items-center justify-center py-5 lg:justify-between">
            {/* Logo */}
            <div className="absolute left-0 shrink-0 lg:static">
              <Link href="/dashboard">
                <span className="sr-only">Email AI Writer</span>
                <img
                  alt="Email AI Writer"
                  src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=300"
                  className="h-8 w-auto"
                />
              </Link>
            </div>
            {/* Right section on desktop */}
            <div className="hidden lg:ml-4 lg:flex lg:items-center lg:pr-0.5">
              <button
                type="button"
                className="relative shrink-0 rounded-full p-1 text-indigo-200 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
              >
                <span className="absolute -inset-1.5" />
                <span className="sr-only">View notifications</span>
                <BellIcon aria-hidden="true" className="size-6" />
              </button>
              {/* Profile dropdown */}
              <Menu as="div" className="relative ml-4 shrink-0">
                <div>
                  <MenuButton className="relative flex rounded-full bg-white text-sm ring-2 ring-white/20 focus:outline-none focus-visible:ring-white">
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Open user menu</span>
                    <img alt="" src={user.imageUrl || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.email)} className="size-8 rounded-full" />
                  </MenuButton>
                </div>
                <MenuItems
                  transition
                  className="absolute right-0 z-10 -mr-2 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none"
                >
                  {userNavigation.map((item) => (
                    <MenuItem key={item.name}>
                      {item.name === 'Sign out' ? (
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {item.name}
                        </button>
                      ) : (
                        <Link
                          href={item.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {item.name}
                        </Link>
                      )}
                    </MenuItem>
                  ))}
                </MenuItems>
              </Menu>
            </div>
            {/* Search */}
            <div className="min-w-0 flex-1 px-12 lg:hidden">
              <div className="mx-auto grid w-full max-w-xs grid-cols-1">
                <input
                  name="search"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                  className="peer col-start-1 row-start-1 block w-full rounded-md bg-white/20 py-1.5 pl-10 pr-3 text-base text-white outline-none placeholder:text-white focus:bg-white focus:text-gray-900 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-white/40 focus:placeholder:text-gray-400 sm:text-sm/6"
                />
                <MagnifyingGlassIcon
                  aria-hidden="true"
                  className="pointer-events-none col-start-1 row-start-1 ml-3 size-5 self-center text-white peer-focus:text-gray-400"
                />
              </div>
            </div>
            {/* Menu button */}
            <div className="absolute right-0 shrink-0 lg:hidden">
              {/* Mobile menu button */}
              <button
                onClick={() => setOpen(true)}
                className="relative inline-flex items-center justify-center rounded-md bg-transparent p-2 text-indigo-200 hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open main menu</span>
                <Bars3Icon aria-hidden="true" className="size-6" />
              </button>
            </div>
          </div>
          <div className="hidden border-t border-white/20 py-5 lg:block">
            <div className="grid grid-cols-3 items-center gap-8">
              <div className="col-span-2">
                <nav className="flex space-x-4">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={classNames(
                        pathname === item.href ? 'text-white' : 'text-indigo-100',
                        'rounded-md px-3 py-2 text-sm font-medium hover:bg-white/10',
                      )}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </div>
              <div className="mx-auto grid w-full max-w-md grid-cols-1">
                <input
                  name="search"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                  className="peer col-start-1 row-start-1 block w-full rounded-md bg-white/20 py-1.5 pl-10 pr-3 text-sm/6 text-white outline-none placeholder:text-white focus:bg-white focus:text-gray-900 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-white/40 focus:placeholder:text-gray-400"
                />
                <MagnifyingGlassIcon
                  aria-hidden="true"
                  className="pointer-events-none col-start-1 row-start-1 ml-3 size-5 self-center text-white peer-focus:text-gray-400"
                />
              </div>
            </div>
          </div>
        </div>
        <Dialog open={open} onClose={setOpen} className="lg:hidden">
          <DialogBackdrop className="fixed inset-0 z-20 bg-black/25 duration-150" />
          <DialogPanel className="absolute inset-x-0 top-0 z-30 mx-auto w-full max-w-3xl origin-top transform p-2 transition duration-150">
            <div className="divide-y divide-gray-200 rounded-lg bg-white shadow-lg ring-1 ring-black/5">
              <div className="pb-2 pt-3">
                <div className="flex items-center justify-between px-4">
                  <div>
                    <img
                      alt="Email AI Writer"
                      src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                      className="h-8 w-auto"
                    />
                  </div>
                  <div className="-mr-2">
                    <button
                      onClick={() => setOpen(false)}
                      className="relative inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500"
                    >
                      <span className="absolute -inset-0.5" />
                      <span className="sr-only">Close menu</span>
                      <XMarkIcon aria-hidden="true" className="size-6" />
                    </button>
                  </div>
                </div>
                <div className="mt-3 space-y-1 px-2">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-800"
                      onClick={() => setOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="pb-2 pt-4">
                <div className="flex items-center px-5">
                  <div className="shrink-0">
                    <img alt="" src={user.imageUrl || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.email)} className="size-10 rounded-full" />
                  </div>
                  <div className="ml-3 min-w-0 flex-1">
                    <div className="truncate text-base font-medium text-gray-800">{user.name || user.email}</div>
                    <div className="truncate text-sm font-medium text-gray-500">{user.email}</div>
                  </div>
                  <button
                    type="button"
                    className="relative ml-auto shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">View notifications</span>
                    <BellIcon aria-hidden="true" className="size-6" />
                  </button>
                </div>
                <div className="mt-3 space-y-1 px-2">
                  {userNavigation.map((item) => (
                    <div key={item.name}>
                      {item.name === 'Sign out' ? (
                        <button
                          onClick={() => {
                            handleLogout();
                            setOpen(false);
                          }}
                          className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-800"
                        >
                          {item.name}
                        </button>
                      ) : (
                        <Link
                          href={item.href}
                          className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-800"
                          onClick={() => setOpen(false)}
                        >
                          {item.name}
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DialogPanel>
        </Dialog>
      </header>
      <main className="-mt-24 pb-8">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
          <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3 lg:gap-8">
            {/* Left column: Welcome and Sequences */}
            <div className="grid grid-cols-1 gap-4 lg:col-span-2">
              <section aria-labelledby="section-1-title">
                <h2 id="section-1-title" className="text-xl font-bold mb-4">Welcome, {user.name || user.email}!</h2>
                <div className="overflow-hidden rounded-lg bg-white shadow">
                  <div className="p-6">
                    <div className="mb-4">
                      <Link href="/dashboard/sequences" className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition">View My Sequences</Link>
                      <Link href="/dashboard/templates" className="ml-4 inline-block bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition">Templates</Link>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Recent Sequences</h3>
                    {loading ? (
                      <div>Loading...</div>
                    ) : sequences.length === 0 ? (
                      <div className="text-gray-500">No sequences found.</div>
                    ) : (
                      <ul className="divide-y divide-gray-100">
                        {sequences.slice(0, 3).map((seq) => (
                          <li key={seq.id} className="py-2">
                            <Link href={`/dashboard/sequences/${seq.id}`} className="text-blue-700 hover:underline font-medium">{seq.businessName || 'Untitled Sequence'}</Link>
                            <span className="ml-2 text-xs text-gray-400">{new Date(seq.createdAt).toLocaleDateString()}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </section>
            </div>
            {/* Right column: Profile summary */}
            <div className="grid grid-cols-1 gap-4">
              <section aria-labelledby="section-2-title">
                <h2 id="section-2-title" className="text-xl font-bold mb-4">Profile</h2>
                <div className="overflow-hidden rounded-lg bg-white shadow">
                  <div className="p-6 flex flex-col items-center">
                    <img
                      alt="Profile"
                      src={user.imageUrl || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.email)}
                      className="size-16 rounded-full mb-2"
                    />
                    <div className="font-semibold text-gray-900">{user.name || user.email}</div>
                    <div className="text-gray-500 text-sm mb-2">{user.email}</div>
                    <Link href="/profile" className="text-indigo-600 hover:underline text-sm">Edit Profile</Link>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
      <footer>
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
          <div className="border-t border-gray-200 py-8 text-center text-sm text-gray-500 sm:text-left">
            <span className="block sm:inline">&copy; 2021 Email AI Writer, Inc.</span>{' '}
            <span className="block sm:inline">All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
} 