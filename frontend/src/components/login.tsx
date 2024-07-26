import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { toast } from "sonner"

export default function Login({ setLogin }: any) {
    const [registerName, setRegisterName] = useState('')
    const [registerPhone, setRegisterPhone] = useState('')
    const [registerPassword, setRegisterPassword] = useState('')



    const [loading, setLoading] = useState(false)

    async function register() {
        const data = {
            username: registerName,
            number: registerPhone,
            password: registerPassword
        }

        try {
            setLoading(true)
            let response = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })

            if (!response.ok) {
                console.error('Failed to register')
                toast.error("Failed to register")
                return
            }

            response = await response.json()
            toast.success("Logged in successfully")
        } catch (error) {
            console.error(error)
            toast.error("Failed to register")
            setLoading(false)
        }
        finally {
            setLoading(false)
            setLogin(true)
        }

    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto p-6 md:p-12">
            <div className="space-y-4">
                <div className="space-y-2">
                    <h2 className="text-3xl font-bold">Login</h2>
                    <p className="text-muted-foreground">Create a new account to get started.</p>
                </div>
                <form className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" placeholder="Enter your name" value={registerName} onChange={(e) => setRegisterName(e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" type="tel" placeholder="Enter your phone number" value={registerPhone} onChange={(e) => setRegisterPhone(e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" placeholder="Enter a password" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading} onClick={register}>
                        Login
                    </Button>
                </form>
            </div>
        </div>
    )
}