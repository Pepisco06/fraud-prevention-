interface Props {
  onNextClick: () => void;
}
const BottomButtons = ({ onNextClick }: Props) => {
  return (
    <div className="flex justify-end gap-4">
      <button
        type="button"
        onClick={close}
        className="hover:text-blue-400 duration-300"
      >
        Cancel
      </button>
      <button
        className="hover:text-blue-400 duration-300"
        onClick={onNextClick}
      >
        Next
      </button>
    </div>
  );
};

export default BottomButtons;
