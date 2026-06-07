import { AuthUIProvider, AuthView } from '@daveyplate/better-auth-ui';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { authClient } from '../../lib/auth-client';

/**
 * Auth view route. Mounted at `/signin`, `/signin/sign-up`,
 * `/signin/forgot-password`, etc. better-auth-ui's `AuthView` reads
 * `pathname` to decide which sub-view (sign-in, sign-up, …) to render.
 *
 * The AuthUIProvider is colocated here on purpose: React.lazy in app.tsx
 * imports this whole module as a separate chunk, so all of
 * @daveyplate/better-auth-ui (~+160KB gzipped) only loads when a user
 * actually hits an /signin route — not on every page view.
 */
export function AuthRoute() {
  const params = useParams<{ pathname?: string }>();
  const navigate = useNavigate();

  // After successful sign-in / sign-up, better-auth-ui calls navigate
  // (or replace) with the post-auth destination — usually `/`. Backroad
  // resolves the session on WS handshake; the existing socket was
  // opened pre-cookie and still sees `br.user.isLoggedIn = false`. A
  // hard reload tears down the old socket and the new connection picks
  // up the fresh cookie. In-auth navigation (signin ↔ signup ↔
  // forgot-password) stays a soft React Router move.
  const isAuthInternal = (href: string) => href.startsWith('/auth');
  const navigateOrReload = (href: string) =>
    isAuthInternal(href) ? navigate(href) : window.location.assign(href);
  const replaceOrReload = (href: string) =>
    isAuthInternal(href)
      ? navigate(href, { replace: true })
      : window.location.replace(href);

  return (
    <AuthUIProvider
      authClient={authClient}
      navigate={navigateOrReload}
      replace={replaceOrReload}
      Link={({ href, ...props }) => <Link to={href} {...props} />}
      // Mount everything under /auth/*. Defaults use hyphenated paths
      // (sign-in, sign-up) which conflict visually with the /auth base;
      // we override to single-word slugs so URLs are /auth/signin,
      // /auth/signup, /auth/forgot, etc.
      basePath="/auth"
      viewPaths={{
        SIGN_IN: 'signin',
        SIGN_UP: 'signup',
        SIGN_OUT: 'signout',
        FORGOT_PASSWORD: 'forgot-password',
        RESET_PASSWORD: 'reset-password',
        EMAIL_VERIFICATION: 'verify-email',
        EMAIL_OTP: 'email-otp',
        MAGIC_LINK: 'magic-link',
        RECOVER_ACCOUNT: 'recover',
        CALLBACK: 'callback',
      }}
      // Enable email/password sign-up alongside sign-in. `name` is the
      // only field collected by default.
      signUp={{ fields: ['name'] }}
      credentials={{ forgotPassword: true }}
    >
      <div className="flex min-h-[60vh] items-center justify-center px-4 py-12">
        <AuthView pathname={params.pathname ?? 'signin'} />
      </div>
    </AuthUIProvider>
  );
}

export default AuthRoute;
