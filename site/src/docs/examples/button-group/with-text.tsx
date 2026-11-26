import { Button } from 'omuk-ui/button';
import { ButtonGroup, ButtonGroupText } from 'omuk-ui/button-group';
import { Input } from 'omuk-ui/input';

export default function ButtonGroupWithText() {
  return (
    <ButtonGroup className="w-full max-w-md">
      <ButtonGroupText>https://</ButtonGroupText>
      <Input aria-label="Website address" placeholder="example.com" />
      <Button variant="outline">Check</Button>
    </ButtonGroup>
  );
}
