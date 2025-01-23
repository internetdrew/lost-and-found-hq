CREATE TRIGGER on_auth_user_verified AFTER UPDATE ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_verified_user();


