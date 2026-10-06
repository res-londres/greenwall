// TODO: create auth card markup in future refactor

export function createAuthScreenHTML() {
    return `
        <div id="auth-screen" class="hidden min-h-dvh items-center justify-center bg-surface-default p-8"  data-authactive="signup">
            <div id="auth-card" class="grid w-full max-w-175 grid-cols-1 md:grid-cols-[1fr_1fr] overflow-hidden rounded-2xl border-2 border-solid border-line-default">
                <div class="flex w-full flex-col overflow-hidden bg-surface-card p-8 max-md:p-6">
                    <p class="mb-2 font-heading text-6xl wrap-break-word">greenwall</p>
                    <p id="auth-welcome-text" class="text-2xl">welcome!</p>
                </div>
                <div class="flex w-full flex-col justify-center overflow-hidden bg-surface-emphasis p-8 max-md:p-6">
                    <p id="auth-right-title" class="mb-4 text-4xl text-fg-inverse">Sign up to Greenwall</p>
                    <div class="mt-3">
                        <label for="auth-account-name-input">Private account name</label>
                        <input class="w-full rounded-lg border-2 border-solid border-line-default bg-surface-card px-4 py-2 text-fg-default placeholder-gray-500 focus:outline-none" type="text" id="auth-account-name-input" data-action="enterSignupAccountName" placeholder="Account name" maxlength="20" />
                    </div>
                    <div class="mt-3">
                        <label for="auth-password-input">Password</label>
                        <input class="w-full rounded-lg border-2 border-solid border-line-default bg-surface-card px-4 py-2 text-fg-default placeholder-gray-500 focus:outline-none" type="password" id="auth-password-input" data-action="enterSignupPassword" placeholder="Password" maxlength="20" />
                    </div>
                    <div id="auth-password-retype-container" class="mt-3">
                        <label for="auth-password-retype">Retype password</label>
                        <input class="w-full rounded-lg border-2 border-solid border-line-default bg-surface-card px-4 py-2 text-fg-default placeholder-gray-500 focus:outline-none" type="password" id="auth-password-retype" data-action="retypeSignupPassword" placeholder="Retype password" maxlength="20" />
                    </div>
                    <div id="auth-profile-name-input-container" class="mt-3">
                        <label for="auth-profile-name-input">First public profile name</label>
                        <input class="w-full rounded-lg border-2 border-solid border-line-default bg-surface-card px-4 py-2 text-fg-default placeholder-gray-500 focus:outline-none" type="text" id="auth-profile-name-input" data-action="enterSignupProfileName" placeholder="Profile name" maxlength="20" />
                    </div>
                    <p id="error-message" class="min-h-15 text-fg-danger"></p>
                    <div class="flex flex-col items-center justify-center gap-4">
                        <button id="auth-button" class="flex content-center justify-center cursor-pointer rounded-4xl border-none bg-fg-default px-16 py-2 text-fg-default transition-all duration-300 enabled:hover:scale-105 active:scale-100 enabled:text-fg-inverse enabled:active:scale-100 disabled:cursor-not-allowed disabled:bg-button-disabled disabled:opacity-50 font-bold" data-action="signup" disabled>Sign up</button>
                        <div class="flex flex-row gap-1">
                            <span id="auth-goto-text" class="text-fg-default">Already have an account? </span>
                            <span id="auth-goto-link" class="cursor-pointer select-none underline transition-all duration-300 hover:text-fg-inverse" data-action="goToLogin">Log in</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}
