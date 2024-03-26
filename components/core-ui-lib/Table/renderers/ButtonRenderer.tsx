import Button from 'components/core-ui-lib/Button';

export default function ButtonRenderer({text}) {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <Button variant='secondary' text={text} />
    </div>
  );
}
