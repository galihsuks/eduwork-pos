const Alert = ({
    teks = "",
    show = false,
    action = () => {},
    cancel = () => {},
}) => {
    return (
        <div className={`alert ${show ? "show" : ""}`}>
            <div className="sub">
                <p className="mb-3">{teks}</p>
                <div className="flex gap-1 justify-center">
                    <button
                        className="btn-putih text-sm"
                        onClick={() => {
                            cancel();
                        }}
                    >
                        Batal
                    </button>
                    <button
                        className="btn-coklat text-sm"
                        onClick={() => {
                            action();
                        }}
                    >
                        Ya
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Alert;
