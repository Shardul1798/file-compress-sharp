(async () => {
    try {
        const app = await import("./src/bootstrap/bootstrap");
        new app.Bootstrap();
    } catch (error) {
        console.log(error)
    }
})();