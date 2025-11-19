async function checkAuth() {
  const { data } = await supabase.auth.getSession();

  if (!data.session) {
    window.location.href = "auth.html";
  }
}

checkAuth();
