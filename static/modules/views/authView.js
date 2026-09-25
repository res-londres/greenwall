// TODO: create auth card markup in future refactor

export function renderAuthScreen() {
    return `
        <div id="auth-screen" class="flex min-h-dvh items-center justify-center bg-surface p-8">
            <div id="auth-card" class="grid w-full max-w-175 grid-cols-[1fr_1fr] overflow-hidden rounded-2xl border-2 border-solid border-primary">
                <div class="flex w-full flex-col overflow-hidden bg-white p-8">
                    <p class="mb-2 font-heading text-6xl wrap-break-word">greenwall</p>
                    <p id="auth-welcome-text" class="text-2xl">welcome!</p>
                </div>
                <div class="flex w-full flex-col justify-center overflow-hidden bg-accent p-8">
                    <p id="auth-right-title" class="mb-4 text-4xl text-white">Sign up to Greenwall</p>
                    <div class="mt-3">
                        <p>Private account name</p>
                        <input class="w-full rounded-lg border-2 border-solid border-primary bg-white px-4 py-2 text-primary placeholder-gray-500 focus:outline-none" type="text" id="auth-account-name-input" data-action="enterSignupAccountName" placeholder="Account name" maxlength="20" />
                    </div>
                    <div class="mt-3">
                        <p>Password</p>
                        <input class="w-full rounded-lg border-2 border-solid border-primary bg-white px-4 py-2 text-primary placeholder-gray-500 focus:outline-none" type="password" id="auth-password-input" data-action="enterSignupPassword" placeholder="Password" maxlength="20" />
                    </div>
                    <div id="auth-password-retype-container" class="mt-3">
                        <label for="auth-password-retype">Retype password</label>
                        <input class="w-full rounded-lg border-2 border-solid border-primary bg-white px-4 py-2 text-primary placeholder-gray-500 focus:outline-none" type="password" id="auth-password-retype" data-action="retypeSignupPassword" placeholder="Retype password" maxlength="20" />
                    </div>
                    <div id="auth-profile-name-input-container" class="mt-3">
                        <p>First public profile name</p>
                        <input class="w-full rounded-lg border-2 border-solid border-primary bg-white px-4 py-2 text-primary placeholder-gray-500 focus:outline-none" type="text" id="auth-profile-name-input" data-action="enterSignupProfileName" placeholder="Profile name" maxlength="20" />
                    </div>
                    <p id="error-message" class="mb-4 min-h-5 text-danger"></p>
                    <div class="flex flex-col items-center justify-center gap-4">
                        <button id="auth-button" class="cursor-pointer rounded-4xl border-none bg-primary px-16 py-2 text-white transition-all duration-300 hover:scale-110 active:scale-100" data-action="signup">Sign up</button>
                        <div class="flex flex-row gap-1">
                            <span id="auth-goto-text" class="text-primary">Already have an account? </span>
                            <span id="auth-goto-link" class="cursor-pointer select-none underline transition-all duration-300 hover:text-white" data-action="goToLogin">Log in</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}
