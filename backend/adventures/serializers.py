from rest_framework import serializers
from .models import Adventure, SavedAdventure


class AdventureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Adventure
        fields = '__all__'


class SavedAdventureSerializer(serializers.ModelSerializer):
    adventure = AdventureSerializer()

    class Meta:
        model = SavedAdventure
        fields = ['id', 'adventure', 'notes', 'is_completed', 'saved_at']

    def create(self, validated_data):
        adventure_data = validated_data.pop('adventure')
        adventure, created = Adventure.objects.get_or_create(
            google_place_id=adventure_data.get('google_place_id', ''),
            defaults=adventure_data
        )

        if not created:
            for key, value in adventure_data.items():
                setattr(adventure, key, value)
            adventure.save()

        return SavedAdventure.objects.create(adventure=adventure, **validated_data)

    def update(self, instance, validated_data):
        instance.notes = validated_data.get('notes', instance.notes)
        instance.is_completed = validated_data.get('is_completed', instance.is_completed)
        instance.save()
        return instance