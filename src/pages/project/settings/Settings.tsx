import {
    Container,
    Button,
    Grid,
    Box,
    Flex,
    Heading,
    Text,
} from "@radix-ui/themes";
import { platform } from "@tauri-apps/api/os";

async function checkGppPath() {
    const commandName = (await platform()) === "win32" ? "where" : "which";
    const commandArgs = (await platform()) === "win32" ? ["g++.exe"] : ["g++"];
}

// 呼叫函式檢查 g++ 的路徑
checkGppPath();

const Settings: React.FC = () => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission logic here
    };

    return (
        <>
            <Container m="6" size="3">
                <form>
                    <div className="form-group">
                        <label htmlFor="cppComplierPath">Email address</label>
                        <input
                            type="email"
                            className="form-control"
                            id="cppComplierPath"
                            placeholder="Select a C++ compiler"
                        />
                        <small id="emailHelp" className="form-text text-muted">
                            We'll never share your email with anyone else.
                        </small>
                    </div>
                    <div className="form-group">
                        <label htmlFor="exampleInputPassword1">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="exampleInputPassword1"
                            placeholder="Password"
                        />
                    </div>
                    <div className="form-check">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id="exampleCheck1"
                        />
                        <label
                            className="form-check-label"
                            htmlFor="exampleCheck1"
                        >
                            Check me out
                        </label>
                    </div>
                    <button type="submit" className="btn btn-primary">
                        Submit
                    </button>
                </form>
            </Container>
        </>
    );
};

export default Settings;
