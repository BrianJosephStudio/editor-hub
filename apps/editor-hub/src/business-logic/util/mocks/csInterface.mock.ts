export default class CSInterfaceMock {
    evalScript = (command: string, callback: (response: string) => void) => {
        const response = `CSInterface mock: ${command}`
        callback(response)
    }
}