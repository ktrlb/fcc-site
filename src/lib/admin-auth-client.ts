// Client-side admin authentication utilities
export async function checkAdminAuth(): Promise<boolean> {
  try {
    const response = await fetch('/api/admin/check-auth', {
      method: 'GET',
      credentials: 'include',
    });
    return response.ok;
  } catch (error) {
    console.error('Error checking admin auth:', error);
    return false;
  }
}

export async function adminLogin(password: string): Promise<boolean> {
  try {
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ password }),
    });
    return response.ok;
  } catch (error) {
    console.error('Error during admin login:', error);
    return false;
  }
}

export async function adminLogout(): Promise<void> {
  try {
    await fetch('/api/admin/logout', {
      method: 'POST',
      credentials: 'include',
    });
  } catch (error) {
    console.error('Error during admin logout:', error);
  }
}
